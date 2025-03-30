import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, query, where, doc, runTransaction, collectionData, updateDoc } from '@angular/fire/firestore';
import { Reserva } from '../interfaces/reserva';
import { Reserva2 } from '../interfaces/reserva-2';
import { Observable } from 'rxjs';
import { update } from '@angular/fire/database';

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
  }

  getListReserva(horario: string, cancha: string): Observable<Reserva2[]>{
    const ref = collection(this.firestore, `horario/${horario}/cancha/${cancha}/${this.collectionName}`)

    return collectionData(ref, {idField: 'id'}) as Observable<Reserva2[]>
  }

  updateEstado(horarioID: string, canchaID: string, reservaID: string, estado: string){
    const path = `horario/${horarioID}/cancha/${canchaID}/reserva`

    const ref = doc(this.firestore, path, reservaID)

    updateDoc(ref, { estado: estado})
      .then(() => console.log("✅ Estado actualizado correctamente"))
      .catch(error => console.error("❌ Error al actualizar:", error));
  }

}
