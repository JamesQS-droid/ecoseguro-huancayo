import { Component, signal, inject, AfterViewInit, OnDestroy, NgZone } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportesService, ReportePunto } from '../../services/reportes';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './mapa.html',
  styleUrl: './mapa.scss'
})
export class MapaComponent implements AfterViewInit, OnDestroy {
  private svc = inject(ReportesService);
  private zone = inject(NgZone);
  reportes = this.svc.reportes;
  seleccionado = signal<ReportePunto | null>(null);
  private mapa!: L.Map;
  private marcadores: L.Marker[] = [];

  ngAfterViewInit() {
    this.iniciarMapa();
  }

  ngOnDestroy() {
    if (this.mapa) this.mapa.remove();
  }

  iniciarMapa() {
    this.mapa = L.map('leaflet-mapa').setView([-12.0653, -75.2049], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.mapa);

    this.agregarMarcadores();
  }

  agregarMarcadores() {
    this.marcadores.forEach(m => m.remove());
    this.marcadores = [];

    this.reportes().forEach(r => {
      const color = r.estado === 'reportado' ? '#EF4444'
        : r.estado === 'en_atencion' ? '#F59E0B' : '#16A34A';

      const icono = r.tipo === 'basura' ? '🗑️'
        : r.tipo === 'nodo' ? '♻️' : '🚛';

      const markerIcon = L.divIcon({
        html: `
          <div style="
            background:${color};
            width:40px;height:40px;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:3px solid #fff;
            box-shadow:0 3px 10px rgba(0,0,0,0.35);
            display:flex;align-items:center;justify-content:center;
            cursor:pointer;
            transition:transform 0.2s;
          ">
            <span style="transform:rotate(45deg);font-size:18px;display:block;text-align:center;line-height:34px">
              ${icono}
            </span>
          </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        className: ''
      });

      const marker = L.marker([r.lat, r.lng], { icon: markerIcon })
        .addTo(this.mapa)
        .on('click', () => {
          this.zone.run(() => {
            this.seleccionado.set(r);
            this.mapa.setView([r.lat, r.lng], 18, { animate: true });
          });
        });

      this.marcadores.push(marker);
    });
  }

  seleccionar(r: ReportePunto) {
    this.seleccionado.set(r);
    this.mapa.setView([r.lat, r.lng], 18, { animate: true });
  }

  async cambiarEstado(estado: ReportePunto['estado']) {
  if (this.seleccionado()) {
    await this.svc.cambiarEstado(this.seleccionado()!.id, estado);
    this.seleccionado.set(null);
    this.agregarMarcadores();
  }
}

  iconTipo(tipo: string) {
    return tipo === 'basura' ? '🗑️' : tipo === 'nodo' ? '♻️' : '🚛';
  }

  estadoLabel(estado: string) {
    return estado === 'reportado' ? 'Reportado'
      : estado === 'en_atencion' ? 'En atención'
      : 'Resuelto';
  }
}