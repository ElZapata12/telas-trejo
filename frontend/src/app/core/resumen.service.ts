import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Resumen } from './modelos';

@Injectable({ providedIn: 'root' })
export class ResumenService {
  private api = inject(ApiService);

  obtener(): Promise<Resumen> {
    return this.api.get<Resumen>('resumen/');
  }
}
