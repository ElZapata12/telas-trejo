import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private storage = inject(StorageService);
  private router = inject(Router);
  private readonly base = environment.apiUrl;

  // Arma la URL completa: 'telas/' -> http://localhost:8000/api/telas/
  private url(ruta: string): string {
    return `${this.base}/${ruta}`;
  }

  // Agrega Authorization: Token <token> si hay sesión
  private encabezados(): HttpHeaders {
    const token = this.storage.leerToken();
    return token
      ? new HttpHeaders({ Authorization: `Token ${token}` })
      : new HttpHeaders();
  }

  async get<T>(ruta: string, params?: Record<string, string>): Promise<T> {
    return await firstValueFrom(
      this.http.get<T>(this.url(ruta), { headers: this.encabezados(), params })
    );
  }

  async post<T>(ruta: string, cuerpo: unknown = {}): Promise<T> {
    return await firstValueFrom(
      this.http.post<T>(this.url(ruta), cuerpo, { headers: this.encabezados() })
    );
  }

  async put<T>(ruta: string, cuerpo: unknown): Promise<T> {
    return await firstValueFrom(
      this.http.put<T>(this.url(ruta), cuerpo, { headers: this.encabezados() })
    );
  }

  async patch<T>(ruta: string, cuerpo: unknown): Promise<T> {
    return await firstValueFrom(
      this.http.patch<T>(this.url(ruta), cuerpo, { headers: this.encabezados() })
    );
  }

  mensajeDeError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'Ocurrió un error inesperado.';
    }
    switch (error.status) {
      case 0:
        return 'No hay conexión con el servidor.';
      case 400:
        return this.mensajeDe400(error.error);
      case 401:
        this.storage.borrarToken();
        this.router.navigate(['/login']);
        return 'Tu sesión expiró. Vuelve a iniciar sesión.';
      case 404:
        return 'No se encontró lo que buscabas.';
      default:
        return error.status >= 500
          ? 'Error del servidor. Intenta más tarde.'
          : 'Ocurrió un error inesperado.';
    }
  }

  // Usa "detail" o, si no hay, el primer error de campo: {"telefono": ["Ya existe..."]}
  private mensajeDe400(cuerpo: unknown): string {
    if (cuerpo && typeof cuerpo === 'object') {
      const datos = cuerpo as Record<string, unknown>;
      if (typeof datos['detail'] === 'string') return datos['detail'];
      const primero = Object.values(datos)[0];
      if (Array.isArray(primero) && typeof primero[0] === 'string') return primero[0];
      if (typeof primero === 'string') return primero;
    }
    return 'Datos inválidos. Revisa la información.';
  }
}
