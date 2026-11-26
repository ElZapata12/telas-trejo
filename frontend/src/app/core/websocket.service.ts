import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';

export type EstadoConexion = 'conectado' | 'reconectando' | 'desconectado';

export interface MensajeWs {
  tipo: string;
  datos: any;
}

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket: WebSocket | null = null;
  private cierreManual = false;
  private reintento: ReturnType<typeof setTimeout> | null = null;

  private readonly estadoInterno = signal<EstadoConexion>('desconectado');
  private readonly busInterno = new Subject<MensajeWs>();

  readonly estado = this.estadoInterno.asReadonly();
  readonly mensajes$ = this.busInterno.asObservable();

  conectar(): void {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }
    this.cierreManual = false;
    this.cancelarReintento();

    const conexion = new WebSocket(environment.wsUrl);
    this.socket = conexion;

    conexion.onopen = () => {
      this.estadoInterno.set('conectado');
    };

    conexion.onmessage = (evento) => {
      try {
        this.busInterno.next(JSON.parse(evento.data));
      } catch (err) {
        console.error('JSON inválido:', err);
      }
    };

    conexion.onerror = (err) => {
      console.error('Error en la conexión:', err);
    };

    conexion.onclose = () => {
      if (this.socket !== conexion) return;

      if (this.cierreManual) {
        this.estadoInterno.set('desconectado');
        return;
      }
      this.estadoInterno.set('reconectando');
      this.reintento = setTimeout(() => {
        this.reintento = null;
        this.conectar();
      }, 3000);
    };
  }

  enviar(mensaje: MensajeWs): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(mensaje));
    }
  }

  desconectar(): void {
    this.cierreManual = true;
    this.cancelarReintento();
    this.socket?.close();
    this.socket = null;
    this.estadoInterno.set('desconectado');
  }

  private cancelarReintento(): void {
    if (this.reintento) {
      clearTimeout(this.reintento);
      this.reintento = null;
    }
  }
}
