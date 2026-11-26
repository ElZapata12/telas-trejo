import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MensajeWs, WebSocketService } from '../../core/websocket.service';

@Component({
  imports: [],
  selector: 'app-avisos',
  styleUrl: './avisos.css',
  templateUrl: './avisos.html',
})
export class Avisos {
  private readonly ws = inject(WebSocketService);
  protected readonly aviso = signal<string | null>(null);
  private temporizador: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.ws.mensajes$
      .pipe(takeUntilDestroyed())
      .subscribe((mensaje) => this.mostrar(mensaje));

    inject(DestroyRef).onDestroy(() => {
      if (this.temporizador) clearTimeout(this.temporizador);
    });
  }

  private mostrar(mensaje: MensajeWs): void {
    let texto: string;
    if (mensaje.tipo === 'pedido_creado') {
      const { folio, cliente, total } = mensaje.datos;
      texto = `Nuevo pedido ${folio} · ${cliente} · $${Number(total).toLocaleString('es-MX')}`;
    } else if (mensaje.tipo === 'eco') {
      texto = `Eco: ${JSON.stringify(mensaje.datos)}`;
    } else {
      return;
    }

    this.aviso.set(texto);
    if (this.temporizador) clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.aviso.set(null), 4000);
  }
}
