import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, query, where, doc, runTransaction, collectionData, updateDoc, getDoc, deleteDoc } from '@angular/fire/firestore';
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

  async addReserva(cancha: string, horario: string, reserva: Reserva2): Promise<Reserva2 | null>{

    const reservaRef = collection(this.firestore, `horario/${horario}/cancha/${cancha}/${this.collectionName}`)
    const canchaRef = doc(this.firestore, `horario/${horario}/cancha/${cancha}`)

    try{
      const reservaDocRef = await runTransaction(this.firestore, async (transaction) => {
        const newReservaRef = await addDoc(reservaRef, reserva)

        const canchaSnap = await transaction.get(canchaRef)

        if(!canchaSnap.exists()){
          throw new Error("❌ El documento de la cancha no existe.")
        }


        const currentInscritos = parseInt(canchaSnap.data()?.['inscritos'] || "0", 10);

        if(isNaN(currentInscritos)){
          throw new Error("❌ El campo 'inscritos' no es un número válido.");
        }

        transaction.update(canchaRef, { inscritos: String(currentInscritos + 1) })

        return newReservaRef;
      })

      const reservaSnapshot = await getDoc(reservaDocRef)

      if (reservaSnapshot.exists()) {
        // console.log("✅ Reserva añadida y campo 'inscritos' actualizado");
        const reservaData = reservaSnapshot.data() as Reserva2;

        return {id: reservaSnapshot.id, ...reservaData}

      } else {
        console.error("❌ La reserva no se pudo recuperar.");
        return null;
      }
    }catch(error){
      console.error("❌ Error en la transacción:", error);
      return null
    }
  }

  deleteReserva(horarioID: string, canchaID: string, reservaID: string){
    const ref = doc(this.firestore, `horario/${horarioID}/cancha/${canchaID}/${this.collectionName}/${reservaID}`)

    return deleteDoc(ref)
  }

  getListReserva(horario: string, cancha: string): Observable<Reserva2[]>{
    const ref = collection(this.firestore, `horario/${horario}/cancha/${cancha}/${this.collectionName}`)

    return collectionData(ref, {idField: 'id'}) as Observable<Reserva2[]>
  }

  async updateEstado(horarioID: string, canchaID: string, reservaID: string, perfilID: string, estado: string){
    const pathHorario = `horario/${horarioID}/cancha/${canchaID}/reserva`
    const pathPerfil = `perfil/${perfilID}/reserva`

    // console.log(pathHorario)
    // console.log(pathPerfil)

    const refHorario = doc(this.firestore, pathHorario, reservaID)
    const refPerfil = doc(this.firestore, pathPerfil, reservaID)

    try {
      await runTransaction(this.firestore, async (transaction) => {
        const horarioSnap = await transaction.get(refHorario);
        const perfilSnap = await transaction.get(refPerfil)

        if(!horarioSnap.exists() || !perfilSnap.exists())
          throw new Error("❌ Uno de los documentos no existe.");

        transaction.update(refHorario, {estado: estado})
        transaction.update(refPerfil, {estado: estado})
      });

      console.log("✅ Estado actualizado correctamente en ambas rutas.");
    } catch (error) {
      console.error("❌ Error en la actualización:", error);
    }
  }

}
