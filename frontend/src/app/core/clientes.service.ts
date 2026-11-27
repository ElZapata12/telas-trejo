import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Cliente, DatosCliente } from './modelos';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private api = inject(ApiService);

  listar(): Promise<Cliente[]> {
    return this.api.get<Cliente[]>('clientes/');
  }

  crear(datos: DatosCliente): Promise<Cliente> {
    return this.api.post<Cliente>('clientes/', datos);
  }

  actualizar(id: number, datos: DatosCliente): Promise<Cliente> {
    return this.api.put<Cliente>(`clientes/${id}/`, datos);
  }
}
