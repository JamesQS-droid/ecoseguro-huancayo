import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportesService } from '../../services/reportes';

@Component({
  selector: 'app-reporte',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './reporte.html',
  styleUrl: './reporte.scss'
})
export class ReporteComponent {
  private svc = inject(ReportesService);
  enviado = signal(false);
  urgencia = signal('media');
  fotoPreview = signal<string | null>(null);
  fotoFecha = signal<Date | null>(null);
  ubicacionGPS = signal<{ lat: number; lng: number } | null>(null);
  buscandoUbicacion = signal(false);
  procesandoFoto = signal(false);

  form = {
    vecino: '',
    tipo: 'basura' as 'basura' | 'nodo' | 'camion',
    descripcion: '',
    ubicacion: ''
  };

  urgencias = [
    { valor: 'baja', label: 'Baja', icon: '🟢', clase: 'baja' },
    { valor: 'media', label: 'Media', icon: '🟡', clase: 'media' },
    { valor: 'alta', label: 'Alta', icon: '🔴', clase: 'alta' },
  ];

  onFotoSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.procesandoFoto.set(true);
    this.comprimirImagen(file, 1024, 0.7).then(comprimida => {
      this.fotoPreview.set(comprimida);
      this.fotoFecha.set(new Date());
      this.procesandoFoto.set(false);
    });

    this.obtenerUbicacion();
    // Limpiar input para permitir volver a tomar la misma foto
    input.value = '';
  }

  private comprimirImagen(file: File, maxAncho: number, calidad: number): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          if (width > maxAncho) {
            height = (height * maxAncho) / width;
            width = maxAncho;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL('image/jpeg', calidad));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  obtenerUbicacion() {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    this.buscandoUbicacion.set(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.ubicacionGPS.set({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        this.buscandoUbicacion.set(false);
      },
      (err) => {
        console.error(err);
        this.buscandoUbicacion.set(false);
        alert('No se pudo obtener tu ubicación. Verifica los permisos del navegador.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  quitarFoto() {
    this.fotoPreview.set(null);
    this.fotoFecha.set(null);
    this.ubicacionGPS.set(null);
  }

  async enviar() {
  if (!this.form.descripcion) return;

  const gps = this.ubicacionGPS();

  await this.svc.agregarReporte({
    lat: gps ? gps.lat : -12.0653 + (Math.random() - 0.5) * 0.01,
    lng: gps ? gps.lng : -75.2049 + (Math.random() - 0.5) * 0.01,
    descripcion: this.form.descripcion,
    tipo: this.form.tipo,
    estado: 'reportado',
    vecino: this.form.vecino || 'Vecino anónimo',
    foto: this.fotoPreview() || undefined,
  });
  this.enviado.set(true);
}

  nuevoReporte() {
    this.form = { vecino: '', tipo: 'basura', descripcion: '', ubicacion: '' };
    this.fotoPreview.set(null);
    this.fotoFecha.set(null);
    this.ubicacionGPS.set(null);
    this.enviado.set(false);
  }
}