import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { ReportesService, ReportePunto } from '../../services/reportes';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent {
  private auth = inject(AuthService);
  private svc = inject(ReportesService);
  private router = inject(Router);

  reportes = this.svc.reportes;
  filtro = signal<'todos' | 'reportado' | 'en_atencion' | 'resuelto'>('todos');
  cargando = signal<string | null>(null);

  get reportesFiltrados() {
    const f = this.filtro();
    if (f === 'todos') return this.reportes();
    return this.reportes().filter(r => r.estado === f);
  }

  get totalReportados() { return this.svc.totalReportados; }
  get totalEnAtencion() { return this.svc.totalEnAtencion; }
  get totalResueltos()  { return this.svc.totalResueltos; }

  async cambiarEstado(r: ReportePunto, estado: ReportePunto['estado']) {
    this.cargando.set(r.id);
    await this.svc.cambiarEstado(r.id, estado);
    this.cargando.set(null);
  }

  estadoLabel(estado: string) {
    return estado === 'reportado' ? 'Reportado'
      : estado === 'en_atencion' ? 'En atención'
      : 'Resuelto';
  }

  iconTipo(tipo: string) {
    return tipo === 'basura' ? '🗑️' : tipo === 'nodo' ? '♻️' : '🚛';
  }

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/mapa']);
  }
}