from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import APIException
from rest_framework.validators import UniqueValidator

from .models import Cliente, DetallePedido, Pago, Pedido, Tela

DIAS_APARTADO = 30
CENTAVO = Decimal("0.01")


class ReglaDeNegocio(APIException):
    status_code = 400
    default_code = "regla_de_negocio"


def calcular_dias_restantes(pedido):
    if pedido.estatus != "APARTADO":
        return None
    return DIAS_APARTADO - (timezone.now() - pedido.fecha).days


def esta_vencido(pedido):
    dias = calcular_dias_restantes(pedido)
    return dias is not None and dias < 0


class TelaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tela
        fields = [
            "id",
            "nombre",
            "metros_por_rollo",
            "ancho_m",
            "peso_kg",
            "precio_rollo",
            "stock_disponible",
            "stock_apartado",
            "color",
        ]


class ClienteSerializer(serializers.ModelSerializer):
    telefono = serializers.CharField(
        max_length=10,
        validators=[
            UniqueValidator(
                queryset=Cliente.objects.all(),
                message="Ya existe un cliente con este teléfono.",
            )
        ],
    )

    class Meta:
        model = Cliente
        fields = ["id", "nombre", "telefono", "estado"]


class PagoSerializer(serializers.ModelSerializer):
    folio = serializers.CharField(source="pedido.folio", read_only=True)
    cliente = serializers.CharField(source="pedido.cliente.nombre", read_only=True)

    class Meta:
        model = Pago
        fields = ["id", "pedido", "folio", "cliente", "monto", "tipo", "metodo", "fecha"]


# ---------- Pedidos: lectura ----------

class DetallePedidoSerializer(serializers.ModelSerializer):
    tela_nombre = serializers.CharField(source="tela.nombre", read_only=True)

    class Meta:
        model = DetallePedido
        fields = ["id", "tela", "tela_nombre", "rollos", "rollos_enviados", "precio_unitario"]


class PagoDelPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = ["id", "monto", "tipo", "metodo", "fecha"]


class PedidoSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    detalles = DetallePedidoSerializer(many=True, read_only=True)
    pagos = PagoDelPedidoSerializer(many=True, read_only=True)
    dias_restantes = serializers.SerializerMethodField()
    vencido = serializers.SerializerMethodField()

    class Meta:
        model = Pedido
        fields = [
            "id",
            "folio",
            "cliente",
            "tipo",
            "estatus",
            "metodo_envio",
            "descuento_pct",
            "total",
            "saldo",
            "fecha",
            "dias_restantes",
            "vencido",
            "detalles",
            "pagos",
        ]

    def get_dias_restantes(self, obj):
        return calcular_dias_restantes(obj)

    def get_vencido(self, obj):
        return esta_vencido(obj)


# ---------- Pedidos: entrada ----------

class ClienteVentaSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=150)
    telefono = serializers.CharField(max_length=10)
    estado = serializers.CharField(max_length=50)


class DetalleVentaSerializer(serializers.Serializer):
    tela = serializers.PrimaryKeyRelatedField(queryset=Tela.objects.all())
    rollos = serializers.IntegerField(min_value=1)


class VentaSerializer(serializers.Serializer):
    cliente = ClienteVentaSerializer()
    tipo = serializers.ChoiceField(choices=Pedido.TIPOS)
    metodo_envio = serializers.ChoiceField(choices=Pedido.METODOS_ENVIO)
    metodo_pago = serializers.ChoiceField(choices=Pago.METODOS)
    descuento_pct = serializers.IntegerField(min_value=0, max_value=100, default=0)
    detalles = DetalleVentaSerializer(many=True, allow_empty=False)

    @transaction.atomic
    def create(self, datos):
        es_apartado = datos["tipo"] == "APARTADO"
        datos_cliente = datos["cliente"]

        cliente, _ = Cliente.objects.get_or_create(
            telefono=datos_cliente["telefono"],
            defaults={"nombre": datos_cliente["nombre"], "estado": datos_cliente["estado"]},
        )

        pedido = Pedido.objects.create(
            cliente=cliente,
            tipo=datos["tipo"],
            estatus="APARTADO" if es_apartado else "EN_TRANSITO",
            metodo_envio=datos["metodo_envio"],
            descuento_pct=datos["descuento_pct"],
        )

        subtotal = Decimal("0")
        for linea in datos["detalles"]:
            tela = Tela.objects.select_for_update().get(pk=linea["tela"].pk)
            rollos = linea["rollos"]
            if tela.stock_disponible < rollos:
                raise ReglaDeNegocio(
                    f"Stock insuficiente de {tela.nombre}: hay {tela.stock_disponible} rollos disponibles."
                )

            enviados = rollos // 2 if es_apartado else rollos
            tela.stock_disponible -= rollos
            tela.stock_apartado += rollos - enviados
            tela.save()

            DetallePedido.objects.create(
                pedido=pedido,
                tela=tela,
                rollos=rollos,
                rollos_enviados=enviados,
                precio_unitario=tela.precio_rollo,
            )
            subtotal += tela.precio_rollo * rollos

        total = (subtotal * (100 - pedido.descuento_pct) / 100).quantize(CENTAVO)
        primer_pago = (total / 2).quantize(CENTAVO) if es_apartado else total

        pedido.total = total
        pedido.saldo = total - primer_pago
        pedido.folio = f"TT-{timezone.localtime(pedido.fecha).year}-{pedido.id:04d}"
        pedido.save()

        Pago.objects.create(
            pedido=pedido,
            monto=primer_pago,
            tipo="ANTICIPO" if es_apartado else "CONTADO",
            metodo=datos["metodo_pago"],
        )
        return pedido


class LiquidarSerializer(serializers.Serializer):
    metodo_pago = serializers.ChoiceField(choices=Pago.METODOS)
