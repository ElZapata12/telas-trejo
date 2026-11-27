import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { MetodoPago, NuevaVenta, Pedido } from './modelos';

@Injectable({ providedIn: 'root' })
export class PedidosService {
  private api = inject(ApiService);

  listar(busqueda = ''): Promise<Pedido[]> {
    const params = busqueda ? { search: busqueda } : undefined;
    return this.api.get<Pedido[]>('pedidos/', params);
  }

  obtener(id: number): Promise<Pedido> {
    return this.api.get<Pedido>(`pedidos/${id}/`);
  }

  crear(venta: NuevaVenta): Promise<Pedido> {
    return this.api.post<Pedido>('pedidos/', venta);
  }

  liquidar(id: number, metodo_pago: MetodoPago): Promise<Pedido> {
    return this.api.post<Pedido>(`pedidos/${id}/liquidar/`, { metodo_pago });
  }

  liberar(id: number): Promise<Pedido> {
    return this.api.post<Pedido>(`pedidos/${id}/liberar/`);
  }

  entregar(id: number): Promise<Pedido> {
    return this.api.post<Pedido>(`pedidos/${id}/entregar/`);
  }
}
