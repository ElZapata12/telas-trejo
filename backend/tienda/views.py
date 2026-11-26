from rest_framework import mixins, viewsets

from .models import Cliente, Pago, Tela
from .serializers import ClienteSerializer, PagoSerializer, TelaSerializer


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
