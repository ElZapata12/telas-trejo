from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Cliente, Pago, Tela


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
