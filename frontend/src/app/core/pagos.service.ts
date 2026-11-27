import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Pago } from './modelos';

@Injectable({ providedIn: 'root' })
export class PagosService {
  private api = inject(ApiService);

  listar(): Promise<Pago[]> {
    return this.api.get<Pago[]>('pagos/');
  }
}
