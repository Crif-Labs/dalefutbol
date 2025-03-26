import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, query, where, doc, runTransaction } from '@angular/fire/firestore';
import { Reserva } from '../interfaces/reserva';
import { Reserva2 } from '../interfaces/reserva-2';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {



  private collectionName = 'reserva'

  constructor(private firestore: Firestore) { }

  async addReserva(cancha: string, horario: string, reserva: Reserva2){

    const reservaRef = collection(this.firestore, `horario/${horario}/cancha/${cancha}/${this.collectionName}`)
    const canchaRef = doc(this.firestore, `horario/${horario}/cancha/${cancha}`)

    try{
      await runTransaction(this.firestore, async (transaction) => {
        await addDoc(reservaRef, reserva)

        const canchaSnap = await transaction.get(canchaRef)

        if(!canchaSnap.exists()){
          throw new Error("❌ El documento de la cancha no existe.")
        }


        const currentInscritos = parseInt(canchaSnap.data()?.['inscritos'] || "0", 10);

        if(isNaN(currentInscritos)){
          throw new Error("❌ El campo 'inscritos' no es un número válido.");
        }

        transaction.update(canchaRef, { inscritos: String(currentInscritos + 1) })
      })

      console.log("✅ Reserva añadida y campo 'inscritos' actualizado con transacción.");
    }catch(error){
      console.error("❌ Error en la transacción:", error);
    }

    // return addDoc(reservaRef, reserva)
  }

  // updateCanchaReserva()

  // addReserva(reserva: Reserva){
  //   const ref = collection(this.firestore, this.collectionName)

  //   return addDoc(ref, reserva)
  // }

  // async getReservaPorCHFH(reserva: Reserva){//(id_cancha: string, id_horario: string, fecha: string, hora_inicio: string){
  //   try{
  //     const ref = collection(this.firestore, this.collectionName)

  //     const q = query(ref, 
  //       where('fecha','==',reserva.fecha),
  //       where('hora_inicio','==',reserva.hora_inicio),
  //       where('cancha.id','==',reserva.cancha.id),
  //       where('horario.id','==',reserva.horario.id)
  //     )

  //     const querySnapshot = await getDocs(q);
  //     const reservas: any[] = []

  //     querySnapshot.forEach( doc => {
  //       reservas.push({id: doc.id, ...doc.data()})
  //     })

  //     return reservas;

  //   }catch(error){
  //     console.error("No se ha podido obtenr las reservas:, ",error)
  //     return []
  //   }
  // }

}
