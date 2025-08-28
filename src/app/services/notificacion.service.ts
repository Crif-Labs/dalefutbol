import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, FirestoreError, getDocs, query, Timestamp, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { Notificacion } from '../interfaces/notificacion';
import { from, map, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  private collectionName = 'notificacion'

  constructor(private firestore: Firestore) { }

  addNotificacion(uid: string, notificacion: Notificacion){
    const ref = collection(this.firestore, `perfil/${uid}/${this.collectionName}`);

    return addDoc(ref, {
      ...notificacion,
      fecha: new Date(),
      leido: false
    })
  }

  getNotificacionesByUser(uid: string): Observable<Notificacion[]>{
    const ref = collection(this.firestore, `perfil/${uid}/${this.collectionName}`)

    return from(getDocs(ref)).pipe(
      map(snapshot => 
        snapshot.docs.map(doc => {
          const data = doc.data() as Notificacion;

          return {
            id: doc.id,
            ...data,
            fecha: (data.fecha as unknown as Timestamp).toDate()
          };
        // id: doc.id,
        // ...doc.data() as Notificacion
        }).sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
      )
    );
  }

  marcarComoLeida(uid: string, id: string){
    const ref = doc(this.firestore, `perfil/${uid}/${this.collectionName}/${id}`)
    return updateDoc(ref, {leido: true})
  }

  marcarTodasComoLeida(uid: string){
    const ref = collection(this.firestore, `perfil/${uid}/${this.collectionName}`)
    const q = query(ref, where('leido','==',false))

    return from(getDocs(q)).pipe(
      switchMap(snapshot => {
        const batch = writeBatch(this.firestore);

        snapshot.forEach( d => {
          const docRef = doc(this.firestore, `perfil/${uid}/${this.collectionName}/${d.id}`);
          batch.update(docRef, { leido: true })
        });

        return from(batch.commit())
      })
    );
  }

  getNotificacionesNoLeidas(uid: string): Observable<any[]> {
    const ref = collection(this.firestore, `perfil/${uid}/${this.collectionName}`);
    const q = query(ref, where('leido', '==', false));

    // collectionData escucha en tiempo real
    return collectionData(q, { idField: 'id' }).pipe(
      map((docs: any[]) =>
        docs.map(doc => ({
          ...doc,
          fecha: (doc.fecha as Timestamp).toDate()
        }))
        .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
      )
    );
  }

}


