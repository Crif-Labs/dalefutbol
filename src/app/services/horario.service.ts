import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, Firestore, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
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


  getHorarioPorDia(dia: string): Observable<Horario[]>{
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

  async getCanchaPorDiaYHorario(dia: string, comuna: string): Promise<Observable<any[]>>{
    return from(this._getCanchasAgrupadas(dia, comuna));
  }


  private async _getCanchasAgrupadas(dia: string, comuna: string): Promise<any[]> {
    const horariosRef = collection(this.firestore, 'horario');
    const q = query(horariosRef, where('dia', '==', dia));
    const snapshot = await getDocs(q);
    const resultado: any[] = [];

    for (const docHorario of snapshot.docs) {
      const horarioData = docHorario.data() as Horario;
      const horarioId = docHorario.id;

      const canchaRef = collection(this.firestore, `horario/${horarioId}/cancha`);
      const canchaQuery = query(canchaRef, where('comuna', '==', comuna));
      const canchasSnap = await getDocs(canchaQuery);

      const canchas: Cancha[] = canchasSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Cancha));

      if (canchas.length > 0) {
        resultado.push({
          horario: { id: horarioId, ...horarioData },
          canchas
        });
      }
    }

    return resultado;
  }


  async getComunasConCanchasDisponible(dia: string): Promise<string[]>{
    const horarioRef = collection(this.firestore, this.collectionName)
    const q = query(horarioRef, where('dia', '==', dia))
    const horarioSnap = await getDocs(q)


    const comunasSet = new Set<string>();

    for(const horarioDoc of horarioSnap.docs){
      const canchaRef = collection(this.firestore, `horario/${horarioDoc.id}/cancha`) as CollectionReference
      const canchaSnap = await getDocs(canchaRef)

      canchaSnap.forEach(doc => {
        const canchaData = doc.data();
        if(canchaData['comuna']){
          comunasSet.add(canchaData['comuna'])
        }
      })
    }

    return Array.from(comunasSet).sort((a,b) => a.localeCompare(b))

  }

  getCanchaHorario(horario: string): Observable<Cancha[]>{
    const collectionRoute = `/horario/${horario}/cancha`

    const ref = collection(this.firestore, collectionRoute)

    return collectionData(ref) as Observable<Cancha[]>
  }

  async getHorario(horaioID: string): Promise<Horario | null>{
    const ref = doc(this.firestore, `${this.collectionName}/${horaioID}`)
    const snap = await getDoc(ref)

    if(snap.exists()){
      return {
        id: snap.id,
        ...snap.data() as Horario
      }
    }else{
      return null
    }

  }


}
