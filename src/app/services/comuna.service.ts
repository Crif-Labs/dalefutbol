import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { Comuna } from '../interfaces/comuna';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunaService {

  private collecionName = 'comuna'

  constructor(private firestore: Firestore) { }

  addComuna(comuna: Comuna){
    const ref = collection(this.firestore, this.collecionName);

    return addDoc(ref, comuna)
  }

  getComunas(): Observable<Comuna[]>{
    const ref = collection(this.firestore, this.collecionName)

    return collectionData(ref, {idField: 'id'}) as Observable<Comuna[]>
  }

  async getComunaByNombre(nombre: string){
    try{
      const ref = collection(this.firestore, this.collecionName)

      const q = query(ref, where('nombre', '==', nombre));

      const element = await getDocs(q)

      if(!element.empty){
        const data: Comuna | any = element.docs[0].data();
        return data
      }
  
      return null;

    }catch(error){
      console.log(error)
      return null
    }
  }
}
