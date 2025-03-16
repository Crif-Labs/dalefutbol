import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { Horario } from '../interfaces/horario';
import { Observable } from 'rxjs';
import { Cancha } from '../interfaces/cancha';

@Injectable({
  providedIn: 'root'
})
export class HorarioService {

  private collectionName = 'horario'

  constructor(private firestore: Firestore) { }

  addHorario(horario: Horario){
    const ref = collection(this.firestore, this.collectionName)

    return addDoc(ref, horario)
  }

  addCanchaToHorario(cancha: Cancha, id: string){
    const ref = collection(this.firestore, `${this.collectionName}/${id}/cancha`)

    return addDoc(ref, cancha)
  }

  async getHorariosHoy(dia: string){

    try{
      const ref = collection(this.firestore, this.collectionName)

      const q = query(ref, where('dia', '==', dia))
      const element = await getDocs(q);

  
      if(!element.empty){
        const data: Horario[] = element.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data() as Horario
          }))

        return data
      }
  
      return null;
    }catch(error){
      console.log('Error getHorarioHoy (horario.service): ',error)
      return null
    }
  }

  getCanchaHorario(horario: string): Observable<Cancha[]>{
    const collectionRoute = `/horario/${horario}/cancha`

    const ref = collection(this.firestore, collectionRoute)

    return collectionData(ref) as Observable<Cancha[]>

  }
}
