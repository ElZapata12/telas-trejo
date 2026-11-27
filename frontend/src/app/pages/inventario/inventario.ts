import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { TelasService } from '../../core/telas.service';
import { Tela } from '../../core/modelos';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-inventario',
  styleUrl: './inventario.css',
  templateUrl: './inventario.html',
})
export class Inventario implements OnInit {
  private telasService = inject(TelasService);
  private api = inject(ApiService);

  telas = signal<Tela[]>([]);
  cargando = signal(true);
  error = signal('');
  guardandoId = signal<number | null>(null);

  // Indicadores: se recalculan solos cuando cambia telas()
  referencias = computed(() => this.telas().length);
  disponibles = computed(() =>
    this.telas().reduce((suma, t) => suma + t.stock_disponible, 0)
  );
  apartados = computed(() =>
    this.telas().reduce((suma, t) => suma + t.stock_apartado, 0)
  );
  valorEstimado = computed(() =>
    this.telas().reduce((suma, t) => suma + t.stock_disponible * t.precio_rollo, 0)
  );

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.cargando.set(true);
    this.error.set('');
    try {
      this.telas.set(await this.telasService.listar());
    } catch (e) {
      this.error.set(this.api.mensajeDeError(e));
    } finally {
      this.cargando.set(false);
    }
  }

  async ajustar(tela: Tela, cambio: number) {
    const nuevo = tela.stock_disponible + cambio;
    if (nuevo < 0) return;

    this.guardandoId.set(tela.id);
    this.error.set('');
    try {
      const actualizada = await this.telasService.ajustarStock(tela.id, nuevo);
      // Reemplaza solo la tela que cambió, con lo que guardó el servidor
      this.telas.update((lista) =>
        lista.map((t) => (t.id === actualizada.id ? actualizada : t))
      );
    } catch (e) {
      this.error.set(this.api.mensajeDeError(e));
    } finally {
      this.guardandoId.set(null);
    }
  }
}
