import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Avisos } from '../shared/avisos/avisos';
import { IndicadorConexion } from '../shared/indicador-conexion/indicador-conexion';
import { WebSocketService } from '../core/websocket.service';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Avisos, IndicadorConexion],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout implements OnInit, OnDestroy {
  private readonly ws = inject(WebSocketService);
  protected readonly menuAbierto = signal(false);

  ngOnInit(): void {
    this.ws.conectar();
  }

  ngOnDestroy(): void {
    this.ws.desconectar();
  }

  protected alternarMenu(): void {
    this.menuAbierto.update((actual) => !actual);
  }

  protected cerrarMenu(): void {
    this.menuAbierto.set(false);
  }
}
