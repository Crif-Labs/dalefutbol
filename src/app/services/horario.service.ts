import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Horario } from '../interfaces/horario';
import { from, map, Observable } from 'rxjs';
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
    // console.log(`${this.collectionName}/${id}/cancha/${cancha.id}`)

    const ref = doc(this.firestore, `${this.collectionName}/${id}/cancha/${cancha.id}`)

    return setDoc(ref, cancha)
  }

  getHorarioDiaHora(dia: string, hora_i: string, hora_f: string): Observable<Horario[]>{
    const ref = collection(this.firestore, this.collectionName)

    const q = query(ref,
      where('dia','==',dia),
      where('hora_inicio','==',hora_i),
      where('hora_fin','==',hora_f),
    )
    
    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map( doc => ({
        id: doc.id,
        ...doc.data() as Horario
      })))
    )
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

  getHorario(dia: string): Observable<Horario[]>{
    const ref = collection(this.firestore, this.collectionName)

    const q = query(ref, where('dia', '==', dia))
    // const element = getDocs(q);

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map( doc => ({
        id: doc.id,
        ...doc.data() as Horario
      })))
    )
  }

  getCanchaHorario(horario: string): Observable<Cancha[]>{
    const collectionRoute = `/horario/${horario}/cancha`

    const ref = collection(this.firestore, collectionRoute)

    return collectionData(ref) as Observable<Cancha[]>

  }
}
