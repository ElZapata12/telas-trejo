import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root'})

export class WebSocketService{
    private socket: WebSocket | null = null;
    private cierreManual = false;
    private estadoInterno=signal<EstadoConexion>('desconectado');
    private busInterno= new Subject<MensajeWs>();
    readonly estado = this.estadoInterno.asReadonly();
    readonly mensajes$=this.busInterno.asObservable();

    conectar(): void{
          if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
  return;
}
this.cierreManual = false;

        const conexion = new WebSocket(environment.wsUrl);
        this.socket = conexion;

       

        conexion.onopen=()=>{
            this.estadoInterno.set('conectado');
        };
        conexion.onerror = (err)=> console.error("Error en la conexion:", err);

       
         conexion.onmessage = (evento)=>{
        try{
            const payload = JSON.parse(evento.data);
            this.busInterno.next(payload)
        }catch (err){
            console.error('Json ivalido:', err)
        }
    };
    conexion.onclose = () => {
        if (!this.cierreManual){
this.estadoInterno.set('reconectando');
        setTimeout(() => {
            this.conectar();
        }, 3000);
        }else{
            this.estadoInterno.set('desconectado');
        }
    
        
    };

   
    }
    enviar(mensaje: MensajeWs):void{
        if (this.socket && this.socket.readyState === WebSocket.OPEN){
            this.socket.send(JSON.stringify(mensaje))
        }
        
    }
    desconectar():void{
        this.cierreManual = true;
        this.socket?.close();
        this.estadoInterno.set('desconectado')
    }
}

export type EstadoConexion='conectado' | 'reconectando' | 'desconectado';

export interface MensajeWs{
tipo: string;
datos: any;
}