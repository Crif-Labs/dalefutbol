import { Injectable } from '@angular/core';
import { Perfil } from '../interfaces/perfil';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Reserva2 } from '../interfaces/reserva-2';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private collectionName = 'perfil'

  constructor(private firestore: Firestore) { }

  addPerfil(perfil: Perfil){

    const ref = collection(this.firestore, this.collectionName);

    return addDoc(ref, perfil);
  }

  getPerfiles(): Observable<Perfil[]>{
    const ref = collection(this.firestore, this.collectionName)

    return collectionData(ref, {idField: 'id'}) as Observable<Perfil[]>
  }

  getPerfilById(id: string): Observable<Perfil>{
    const ref = doc(this.firestore, `${this.collectionName}/${id}`)

    return docData(ref, {idField: 'id'}) as Observable<Perfil>
  }

  async getPerfilByUID(uid: string): Promise<Perfil | null>{

    try{
      const ref = collection(this.firestore, `${this.collectionName}`)

      const q = query(ref, where('id_usuario','==',uid))
      const element = await getDocs(q)

      if(!element.empty){
        const data: Perfil | any = element.docs.map(
          doc => ({
            id: doc.id,
            ...doc.data() as Perfil
          })
        )[0]
        return data
      }

      return null;
    }catch(error){
      return null
    }
  }

  async getRolPerfil(id_usuario:string){

    try{
      const ref = collection(this.firestore, this.collectionName)

      const q =  query(ref,where('id_usuario', '==', id_usuario));
      const element = await getDocs(q);

  
      if(!element.empty){
        const data: Perfil | any = element.docs[0].data();

        return data.rol
      }
  
      return null;
    }catch (error) {
      console.error('Error al obtener el rol: ', error)
      return null
    }

  }

  async getComunaPerfil(id:string){
    try{
      const ref = collection(this.firestore, this.collectionName)

      const q =  query(ref,where('id_usuario', '==', id));
      const element = await getDocs(q);

  
      if(!element.empty){
        const data: Perfil | any = element.docs[0].data();

        return data.comuna
      }
  
      return null;
    }catch (error) {
      console.error('Error al obtener la comuna: ', error)
      return null
    }
  }


  async addReservaToPerfil(perfilID: string, reserva: Reserva2): Promise<boolean>{
    try{
      const ref = doc(this.firestore, `${this.collectionName}/${perfilID}/reserva/${reserva.id}`)

      await setDoc(ref, reserva)
      return true;
    }catch{
      return false;
    }    
  }

  getReservaFromPerfil(perfilID: string): Observable<Reserva2[]>{
      const ref = collection(this.firestore, `perfil/${perfilID}/reserva`)
      
      return collectionData(ref, {idField: 'id'}) as Observable<Reserva2[]>
  }

  // getReservaFromPerfil(perfilID: string): Observable<any>{

  // }

  updatePerfil(id: string, perfil: Partial<Perfil>){
    const ref = doc(this.firestore, `${this.collectionName}/${id}`)

    return updateDoc(ref, perfil);
  }

  deleteItem(id: string){
    const ref = doc(this.firestore, `${this.collectionName}/${id}`)

    return deleteDoc(ref)
  }
}
