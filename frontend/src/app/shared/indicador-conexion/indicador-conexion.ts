import { Component, inject } from '@angular/core';
import { WebSocketService } from '../../core/websocket.service';

@Component({
  imports: [],
  selector: 'app-indicador-conexion',
  styleUrl: './indicador-conexion.css',
  templateUrl: './indicador-conexion.html',
})
export class IndicadorConexion {
  protected readonly ws = inject(WebSocketService);
}
