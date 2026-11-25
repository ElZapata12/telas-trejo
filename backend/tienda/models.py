from django.db import models
from django.utils import timezone


class Tela(models.Model):
    nombre = models.CharField(max_length=100)
    metros_por_rollo = models.PositiveIntegerField()
    ancho_m = models.DecimalField(max_digits=4, decimal_places=2)
    peso_kg = models.DecimalField(max_digits=6, decimal_places=2)
    precio_rollo = models.DecimalField(max_digits=10, decimal_places=2)
    stock_disponible = models.PositiveIntegerField(default=0)
    stock_apartado = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=7, default="#000000")

    def __str__(self):
        return self.nombre


class Cliente(models.Model):
    nombre = models.CharField(max_length=150)
    telefono = models.CharField(max_length=10, unique=True)
    estado = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre


class Pedido(models.Model):
    TIPOS = [("CONTADO", "Contado"), ("APARTADO", "Apartado")]
    ESTATUS = [
        ("APARTADO", "Apartado"),
        ("EN_TRANSITO", "En tránsito"),
        ("ENTREGADO", "Entregado"),
        ("EXPIRADO", "Expirado"),
    ]
    METODOS_ENVIO = [
        ("PAQUETERIA", "Paquetería"),
        ("ESTANDAR", "Estándar"),
        ("ENTREGA_DIRECTA", "Entrega directa (Don Trejo)"),
    ]

    folio = models.CharField(max_length=20, unique=True, null=True, blank=True)
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name="pedidos")
    tipo = models.CharField(max_length=10, choices=TIPOS)
    estatus = models.CharField(max_length=15, choices=ESTATUS)
    metodo_envio = models.CharField(max_length=20, choices=METODOS_ENVIO)
    descuento_pct = models.PositiveIntegerField(default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    saldo = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    fecha = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-fecha"]

    def __str__(self):
        return self.folio or f"Pedido {self.id}"


class DetallePedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="detalles")
    tela = models.ForeignKey(Tela, on_delete=models.PROTECT)
    rollos = models.PositiveIntegerField()
    rollos_enviados = models.PositiveIntegerField(default=0)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.rollos} rollos de {self.tela}"


class Pago(models.Model):
    TIPOS = [
        ("CONTADO", "Contado"),
        ("ANTICIPO", "Anticipo"),
        ("LIQUIDACION", "Liquidación"),
    ]
    METODOS = [
        ("EFECTIVO", "Efectivo"),
        ("TRANSFERENCIA", "Transferencia"),
        ("TARJETA", "Tarjeta"),
    ]

    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="pagos")
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    tipo = models.CharField(max_length=15, choices=TIPOS)
    metodo = models.CharField(max_length=15, choices=METODOS)
    fecha = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-fecha"]

    def __str__(self):
        return f"{self.tipo} ${self.monto}"
