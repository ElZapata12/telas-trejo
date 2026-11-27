import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Tela } from './modelos';

@Injectable({ providedIn: 'root' })
export class TelasService {
  private api = inject(ApiService);

  listar(): Promise<Tela[]> {
    return this.api.get<Tela[]>('telas/');
  }

  ajustarStock(id: number, stock_disponible: number): Promise<Tela> {
    return this.api.patch<Tela>(`telas/${id}/`, { stock_disponible });
  }
}
