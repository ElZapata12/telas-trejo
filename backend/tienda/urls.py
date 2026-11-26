from rest_framework.routers import DefaultRouter

from .views import ClienteViewSet, PagoViewSet, TelaViewSet

router = DefaultRouter()
router.register("telas", TelaViewSet)
router.register("clientes", ClienteViewSet)
router.register("pagos", PagoViewSet)

urlpatterns = router.urls
