import { Injectable, signal } from '@angular/core';
import { db } from '../firebase.config';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore';

export interface ReportePunto {
  id: string;
  lat: number;
  lng: number;
  descripcion: string;
  tipo: 'basura' | 'nodo' | 'camion';
  estado: 'reportado' | 'en_atencion' | 'resuelto';
  fecha: Date;
  vecino: string;
  foto?: string;
}

@Injectable({ providedIn: 'root' })
export class ReportesService {

  private _reportes = signal<ReportePunto[]>([]);
  readonly reportes = this._reportes.asReadonly();
  private coleccion = collection(db, 'reportes');

  constructor() {
    this.escucharCambios();
  }

  private escucharCambios() {
    const q = query(this.coleccion, orderBy('fecha', 'desc'));

    onSnapshot(q, (snapshot) => {
      const datos: ReportePunto[] = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          lat: data['lat'],
          lng: data['lng'],
          descripcion: data['descripcion'],
          tipo: data['tipo'],
          estado: data['estado'],
          fecha: data['fecha'] instanceof Timestamp ? data['fecha'].toDate() : new Date(),
          vecino: data['vecino'],
          foto: data['foto'] || undefined,
        };
      });
      this._reportes.set(datos);
    });
  }

  async agregarReporte(reporte: Omit<ReportePunto, 'id' | 'fecha'>) {
    await addDoc(this.coleccion, {
      ...reporte,
      fecha: Timestamp.now()
    });
  }

  async cambiarEstado(id: string, estado: ReportePunto['estado']) {
    const ref = doc(db, 'reportes', id);
    await updateDoc(ref, { estado });
  }

  get totalReportados() {
    return this._reportes().filter(r => r.estado === 'reportado').length;
  }

  get totalEnAtencion() {
    return this._reportes().filter(r => r.estado === 'en_atencion').length;
  }

  get totalResueltos() {
    return this._reportes().filter(r => r.estado === 'resuelto').length;
  }
}