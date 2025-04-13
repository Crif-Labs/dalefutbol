import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Cancha } from '../interfaces/cancha';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanchaService {

  private collectionName = 'cancha'

  constructor(private firestore: Firestore) { }

    addCollection(data: Cancha){
      const ref = collection(this.firestore, this.collectionName)
  
      return addDoc(ref, data)
    }

    async updateImgUrls(canchaID: string, urls: string[]){
      const ref = doc(this.firestore, `${this.collectionName}/${canchaID}`)

      try{
        await updateDoc(ref, {link_image: urls})
        console.log("Realizado!")
      }catch(error){
        console.error("Error al actualizar URLs: ",error)
      }
    }

    getListCollection(): Observable<Cancha[]>{
      const ref = collection(this.firestore, this.collectionName)
  
      return collectionData(ref, {idField: 'id'}) as Observable<Cancha[]>
    }

    getCanchasByComunas(comuna: string): Observable<Cancha[]>{
      const ref = collection(this.firestore, this.collectionName)
      const q = query(ref, where('comuna','==',comuna))

      return collectionData(q, { idField: 'id'}) as Observable<Cancha[]>
    }

    async getCanchaFromHorario(horarioID: string, canchaID: string): Promise<Cancha | null>{
      const ref = doc(this.firestore, `horario/${horarioID}/cancha/${canchaID}`)
      const snap = await getDoc(ref)

      if(snap.exists()){
        return {
          id: snap.id,
          ...snap.data() as Cancha
        }
      }else{
        return null
      }
    }


}
