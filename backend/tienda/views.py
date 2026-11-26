from django.db import transaction
from rest_framework import filters, mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Cliente, Pago, Pedido, Tela
from .serializers import (
    ClienteSerializer,
    LiquidarSerializer,
    PagoSerializer,
    PedidoSerializer,
    ReglaDeNegocio,
    TelaSerializer,
    VentaSerializer,
    esta_vencido,
)


class TelaViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Tela.objects.order_by("nombre")
    serializer_class = TelaSerializer
    http_method_names = ["get", "patch", "head", "options"]


class ClienteViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Cliente.objects.order_by("nombre")
    serializer_class = ClienteSerializer


class PagoViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Pago.objects.select_related("pedido__cliente").order_by("-fecha")
    serializer_class = PagoSerializer


class PedidoViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = (
        Pedido.objects.select_related("cliente")
        .prefetch_related("detalles__tela", "pagos")
        .order_by("-fecha")
    )
    serializer_class = PedidoSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ["folio", "cliente__telefono", "cliente__nombre"]

    def responder(self, pedido_id, codigo=status.HTTP_200_OK):
        pedido = self.get_queryset().get(pk=pedido_id)
        return Response(PedidoSerializer(pedido).data, status=codigo)

    def create(self, request, *args, **kwargs):
        entrada = VentaSerializer(data=request.data)
        entrada.is_valid(raise_exception=True)
        pedido = entrada.save()
        return self.responder(pedido.id, status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def liquidar(self, request, pk=None):
        entrada = LiquidarSerializer(data=request.data)
        entrada.is_valid(raise_exception=True)

        with transaction.atomic():
            pedido = self.get_object()
            pedido = Pedido.objects.select_for_update().get(pk=pedido.pk)  
            if pedido.estatus != "APARTADO" or esta_vencido(pedido):
                raise ReglaDeNegocio("Solo se pueden liquidar apartados vigentes.")

            for detalle in pedido.detalles.all():
                pendientes = detalle.rollos - detalle.rollos_enviados
                tela = Tela.objects.select_for_update().get(pk=detalle.tela_id)
                tela.stock_apartado -= pendientes
                tela.save()
                detalle.rollos_enviados = detalle.rollos
                detalle.save()

            Pago.objects.create(
                pedido=pedido,
                monto=pedido.saldo,
                tipo="LIQUIDACION",
                metodo=entrada.validated_data["metodo_pago"],
            )
            pedido.saldo = 0
            pedido.estatus = "EN_TRANSITO"
            pedido.save()

        return self.responder(pedido.id)

    @action(detail=True, methods=["post"])
    def liberar(self, request, pk=None):
        with transaction.atomic():
            pedido = self.get_object()
            pedido = Pedido.objects.select_for_update().get(pk=pedido.pk)
            if pedido.estatus != "APARTADO" or not esta_vencido(pedido):
                raise ReglaDeNegocio("Solo se pueden liberar apartados vencidos.")

            for detalle in pedido.detalles.all():
                pendientes = detalle.rollos - detalle.rollos_enviados
                tela = Tela.objects.select_for_update().get(pk=detalle.tela_id)
                tela.stock_apartado -= pendientes
                tela.stock_disponible += pendientes
                tela.save()

            pedido.estatus = "EXPIRADO"
            pedido.save()

        return self.responder(pedido.id)

    @action(detail=True, methods=["post"])
    def entregar(self, request, pk=None):
        pedido = self.get_object()
        if pedido.estatus != "EN_TRANSITO":
            raise ReglaDeNegocio("Solo se pueden entregar pedidos en tránsito.")

        pedido.estatus = "ENTREGADO"
        pedido.save()
        return self.responder(pedido.id)
