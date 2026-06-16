import { Routes } from '@angular/router';
import { MapaComponent } from './components/mapa/mapa';
import { ReporteComponent } from './components/reporte/reporte';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AdminLoginComponent } from './components/admin-login/admin-login';
import { AdminComponent } from './components/admin/admin';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'mapa', pathMatch: 'full' },
  { path: 'mapa', component: MapaComponent },
  { path: 'reporte', component: ReporteComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
];