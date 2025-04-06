import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, query, where, doc, runTransaction, collectionData, updateDoc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { Reserva } from '../interfaces/reserva';
import { Reserva2 } from '../interfaces/reserva-2';
import { Observable } from 'rxjs';
import { update } from '@angular/fire/database';
import { PerfilService } from './perfil.service';
import { CanchaService } from './cancha.service';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {



  private collectionName = 'reserva'

  constructor(private firestore: Firestore, private perfilService: PerfilService) { }

  async addReserva(cancha: string, horario: string, perfilID: string, reserva: Reserva2): Promise<Reserva2 | null>{
    const reservaRef = collection(this.firestore, `horario/${horario}/cancha/${cancha}/${this.collectionName}`)
    const newReservaRef = doc(reservaRef)
    const canchaRef = doc(this.firestore, `horario/${horario}/cancha/${cancha}`)
    const perfilReservaRef = doc(this.firestore, `perfil/${perfilID}/reserva/${newReservaRef.id}`)

    reserva.id = newReservaRef.id

    try {
      await runTransaction(this.firestore, async (transaction) => {
        const canchaSnap = await transaction.get(canchaRef)

        if(!canchaSnap.exists()) throw new Error("❌ El documento de la cancha no existe.");

        const currentInscritos = parseInt(canchaSnap.data()?.['inscritos'] || "0", 10)
        if(isNaN(currentInscritos)) throw new Error("❌ El campo 'inscritos' no es un número válido.");

        
        transaction.set(newReservaRef, reserva)
        transaction.set(perfilReservaRef, reserva)
        transaction.update(canchaRef, { inscritos: String(currentInscritos + 1)});
      });

      return reserva;


    } catch (error) {
      console.error("❌ Error en la transacción:", error);
      return null;
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
    const pathCancha = `horario/${horarioID}/cancha`

    console.log("ID que recibe desde el componente: ",perfilID)

    const refHorario = doc(this.firestore, pathHorario, reservaID)
    const refPerfil = doc(this.firestore, pathPerfil, reservaID)
    const refCancha = doc(this.firestore, pathCancha, canchaID)


    try {
      await runTransaction(this.firestore, async (transaction) => {
        const horarioSnap = await transaction.get(refHorario);
        const perfilSnap = await transaction.get(refPerfil)
        const canchaSnap = await transaction.get(refCancha)

        console.log("Path referencia: ",refHorario.path)

        /// perfil/I6LLbwKDdCNDs8B7i2aT/reserva/hnvMTNex9WFhTgb6uRNq
        console.log("Path referencia: ",refPerfil.path)
        console.log("Path Firebase: perfil/I6LLbwKDdCNDs8B7i2aT/reserva/hnvMTNex9WFhTgb6uRNq")
        console.log("Path referencia: ",refCancha.path)

        if(!horarioSnap.exists()){
          throw new Error("❌ Uno de los documentos no existe: (pathHorario)");
        }else if(!perfilSnap.exists()){
          throw new Error("❌ Uno de los documentos no existe: (pathPerfil)");
        }else if(!canchaSnap.exists()){
          throw new Error("❌ Uno de los documentos no existe: (pathCancha)");
        }
          

        const currentConfirmados = parseInt(canchaSnap.data()?.['confirmados'] || "0", 10)
        if(isNaN(currentConfirmados))
          throw new Error("❌ El campo 'confirmados' no es un número válido.");


        const estadoAnterior = perfilSnap.data()?.['estado'];

        if (estado === 'Confirmado' && estadoAnterior !== 'Confirmado') {
          transaction.update(refCancha, { confirmados: String(currentConfirmados + 1) });
        }        
        if (estado === 'Pendiente' && estadoAnterior === 'Confirmado') {
          transaction.update(refCancha, { confirmados: String(currentConfirmados - 1) });
        }        
        if (estado === 'Cancelado' && estadoAnterior === 'Confirmado') {
          transaction.update(refCancha, { confirmados: String(currentConfirmados - 1) });
        }
        

        transaction.update(refHorario, {estado: estado})
        transaction.update(refPerfil, {estado: estado})

      });

      console.log("✅ Estado actualizado correctamente en ambas rutas.");
    } catch (error) {
      console.error("❌ Error en la actualización:", error);
    }
  }

}
