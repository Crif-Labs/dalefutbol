import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  private numeroTelefonico: string = '56982267305'

  constructor() { }

  consultaMiReserva(uid: string, idReserva: string, estado:string | undefined, message: string){    
    const text = 
      `*MENSAJE GENERADO AUTOMATICAMENTE*\n\n` +
      `*Mensaje:* ${message} \n\n` +
      `*Usuario:* ${uid} \n` +
      `*Reserva:* ${idReserva}\n` +
      `*Estado:* ${estado}`


    const url = `https://wa.me/${this.numeroTelefonico}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blanck')
  }

  contactSupport(uid: string,nombre: string, apellido: string, message: string){
    const text = 
      `*MENSAJE GENERADO AUTOMATICAMENTE*\n\n` +
      `*Usuario:* ${nombre} ${apellido} \n` +
      `*ID:* ${uid} \n\n` +
      `*Mensaje:* ${message}`

    const url = `https://wa.me/${this.numeroTelefonico}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blanck')
  }

  reservaCheckOut(uid: string, nombre: string, apellido: string, idReserva: string, monto: number){
    const text =
      `*MENSAJE GENERADO AUTOMATICAMENTE*\n` +
    `* *Recuerda compartir tu voucher para confirmar la reserva*\n\n` +
    `*ID:* ${uid}\n`+
    `*Usuario:* ${nombre} ${apellido}\n`+
    `*Reserva:* ${idReserva}\n`+
    `*Monto:* ${monto}\n`

    const url = `https://wa.me/${this.numeroTelefonico}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blanck')
  }


}
