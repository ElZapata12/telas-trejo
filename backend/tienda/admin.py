from django.contrib import admin

from .models import Cliente, DetallePedido, Pago, Pedido, Tela


@admin.register(Tela)
class TelaAdmin(admin.ModelAdmin):
    list_display = ["nombre", "precio_rollo", "stock_disponible", "stock_apartado"]


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ["nombre", "telefono", "estado"]


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ["folio", "cliente", "tipo", "estatus", "total", "saldo", "fecha"]


@admin.register(DetallePedido)
class DetallePedidoAdmin(admin.ModelAdmin):
    list_display = ["pedido", "tela", "rollos", "rollos_enviados", "precio_unitario"]


@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ["pedido", "tipo", "metodo", "monto", "fecha"]
