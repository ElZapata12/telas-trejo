export type TipoPedido = 'CONTADO' | 'APARTADO';
export type EstatusPedido = 'APARTADO' | 'EN_TRANSITO' | 'ENTREGADO' | 'EXPIRADO';
export type MetodoEnvio = 'PAQUETERIA' | 'ESTANDAR' | 'ENTREGA_DIRECTA';
export type TipoPago = 'CONTADO' | 'ANTICIPO' | 'LIQUIDACION';
export type MetodoPago = 'EFECTIVO' | 'TRANSFERENCIA' | 'TARJETA';

export interface Tela {
  id: number;
  nombre: string;
  metros_por_rollo: number;
  ancho_m: number;
  peso_kg: number;
  precio_rollo: number;
  stock_disponible: number;
  stock_apartado: number;
  color: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  estado: string;
}

// Datos que se mandan para crear o editar un cliente (sin id)
export type DatosCliente = Omit<Cliente, 'id'>;

export interface DetallePedido {
  id: number;
  tela: number;
  tela_nombre: string;
  rollos: number;
  rollos_enviados: number;
  precio_unitario: number;
}

// Pago tal como viene dentro de un pedido
export interface PagoDePedido {
  id: number;
  monto: number;
  tipo: TipoPago;
  metodo: MetodoPago;
  fecha: string;
}

// Pago tal como viene en GET /api/pagos/
export interface Pago extends PagoDePedido {
  pedido: number;
  folio: string;
  cliente: string;
}

export interface Pedido {
  id: number;
  folio: string;
  cliente: Cliente;
  tipo: TipoPedido;
  estatus: EstatusPedido;
  metodo_envio: MetodoEnvio;
  descuento_pct: number;
  total: number;
  saldo: number;
  fecha: string;
  dias_restantes: number | null;
  vencido: boolean;
  detalles: DetallePedido[];
  pagos: PagoDePedido[];
}

// Cuerpo de POST /api/pedidos/
export interface NuevaVenta {
  cliente: DatosCliente;
  tipo: TipoPedido;
  metodo_envio: MetodoEnvio;
  metodo_pago: MetodoPago;
  descuento_pct: number;
  detalles: { tela: number; rollos: number }[];
}

export interface Resumen {
  indicadores: {
    ventas: number;
    pedidos: number;
    apartados_vigentes: number;
    saldo_por_cobrar: number;
  };
  rollos_por_tela: { tela: string; rollos: number }[];
  pedidos_por_estatus: { estatus: EstatusPedido; total: number }[];
  ventas_por_estado: { estado: string; total: number }[];
}
