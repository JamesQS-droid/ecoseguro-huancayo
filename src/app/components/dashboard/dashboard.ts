import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportesService } from '../../services/reportes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  private svc = inject(ReportesService);
  reportes = this.svc.reportes;
  totalReportados = () => this.svc.totalReportados;
  totalEnAtencion = () => this.svc.totalEnAtencion;
  totalResueltos = () => this.svc.totalResueltos;

  camiones = [
    { zona: 'Av. Francisca — Cuadra 1-4', horario: '7:00 AM', dias: 'Lun, Mié, Vie', ruta: 'Inicio: Jr. Loreto → Av. Ferroviaria', activo: true },
    { zona: 'Av. Francisca — Cuadra 5-8', horario: '7:45 AM', dias: 'Lun, Mié, Vie', ruta: 'Inicio: Av. Ferroviaria → Jr. Ancash', activo: false },
    { zona: 'Zona comercial WISA', horario: '6:30 AM', dias: 'Mar, Jue, Sáb', ruta: 'Circuito comercial zona norte', activo: false },
  ];

  iconTipo(tipo: string) {
    return tipo === 'basura' ? '🗑️' : tipo === 'nodo' ? '♻️' : '🚛';
  }

  estadoLabel(estado: string) {
    return estado === 'reportado' ? 'Reportado'
      : estado === 'en_atencion' ? 'En atención'
      : 'Resuelto';
  }
}