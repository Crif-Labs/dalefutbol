import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore, getDocs, query, where, doc, runTransaction, collectionData, updateDoc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { Reserva } from '../interfaces/reserva';
import { Reserva2 } from '../interfaces/reserva-2';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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

  getPerfilesPorColorReserva(horarioID: string, canchaID: string, color1: string, color2: string): Observable<{color1: any[], color2: any[]}>{
    const reservaPath = `horario/${horarioID}/cancha/${canchaID}/${this.collectionName}`;
    const reservaRef = collection(this.firestore, reservaPath)
    const q = query(reservaRef, where('estado','==','Confirmado'))

    return collectionData(q, {idField: 'id'}).pipe(
      map((reservas: any[]) => {
        return {
          color1: reservas
            .filter(r => r.color === color1)
            .map(r => ({ nombre: r.responsable.nombre, apellido: r.responsable.apellido})),
          color2: reservas
            .filter(r => r.color === color2)
            .map(r => ({ nombre: r.responsable.nombre, apellido: r.responsable.apellido}))
        }
      })
    )
  }

  async updateEstado(horarioID: string, canchaID: string, reservaID: string, perfilID: string, estado: string){
    const pathHorario = `horario/${horarioID}/cancha/${canchaID}/reserva`
    const pathPerfil = `perfil/${perfilID}/reserva`
    const pathCancha = `horario/${horarioID}/cancha`

    const refHorario = doc(this.firestore, pathHorario, reservaID)
    const refPerfil = doc(this.firestore, pathPerfil, reservaID)
    const refCancha = doc(this.firestore, pathCancha, canchaID)


    try {
      await runTransaction(this.firestore, async (transaction) => {
        const horarioSnap = await transaction.get(refHorario);
        const perfilSnap = await transaction.get(refPerfil)
        const canchaSnap = await transaction.get(refCancha)


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
