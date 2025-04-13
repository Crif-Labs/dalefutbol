import { Injectable } from '@angular/core';
import { Reserva2 } from '../interfaces/reserva-2';
import { Horario } from '../interfaces/horario';
import { Cancha } from '../interfaces/cancha';

@Injectable({
  providedIn: 'root'
})
export class ReservaTransferServiceService {

  reserva: Reserva2 | null = null;
  horario: Horario | null = null;
  cancha: Cancha | null = null;
  
  constructor() { }

  setDatos(data: { reserva: any; horario: any; cancha: any }) {
    this.reserva = data.reserva;
    this.horario = data.horario;
    this.cancha = data.cancha;
  }

  getDatos() {
    return {
      reserva: this.reserva,
      horario: this.horario,
      cancha: this.cancha,
    };
  }

  clearDatos() {
    this.reserva = null;
    this.horario = null;
    this.cancha = null;
  }

}
