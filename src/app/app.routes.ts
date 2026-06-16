import { Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa';
import { ReporteComponent } from './components/reporte/reporte';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'mapa', pathMatch: 'full' },
  { path: 'mapa', component: MapaComponent },
  { path: 'reporte', component: ReporteComponent },
  { path: 'dashboard', component: DashboardComponent },
];