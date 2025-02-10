import { Injectable } from '@angular/core';
import { Perfil } from '../interfaces/perfil';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

  updatePerfil(id: string, perfil: Partial<Perfil>){
    const ref = doc(this.firestore, `${this.collectionName}/${id}`)

    return updateDoc(ref, perfil);
  }

  deleteItem(id: string){
    const ref = doc(this.firestore, `${this.collectionName}/${id}`)

    return deleteDoc(ref)
  }
}
