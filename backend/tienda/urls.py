from rest_framework.routers import DefaultRouter

from .views import ClienteViewSet, PagoViewSet, TelaViewSet, PedidoViewSet

router = DefaultRouter()
router.register("telas", TelaViewSet)
router.register("clientes", ClienteViewSet)
router.register("pedidos", PedidoViewSet)
router.register("pagos", PagoViewSet)

urlpatterns = router.urls
