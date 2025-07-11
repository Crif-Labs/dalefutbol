import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, docData, Firestore, getDocs, query, runTransaction, where } from '@angular/fire/firestore';
import { Equipo } from '../interfaces/equipo';
import { Observable } from 'rxjs';
import { EquipoEstadistica } from '../interfaces/equipo-estadistica';
import { EquipoJugador } from '../interfaces/equipo-jugador';
import { Perfil } from '../interfaces/perfil';
import { PerfilService } from './perfil.service';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {

  private collectionName = 'equipo'

  constructor(private firestore: Firestore, private perfilService: PerfilService) { }

  async createEquipo(data: Equipo, perfilId: string): Promise<Equipo | null>{
    const equipoRef = collection(this.firestore, this.collectionName)
    const newEquipoRef = doc(equipoRef)

    const perfilEquipoRef = doc(this.firestore, `perfil/${perfilId}/${this.collectionName}/${newEquipoRef.id}`);

    const jugadorRef =  doc(this.firestore, `equipo/${newEquipoRef.id}/jugador/${perfilId}`)

    data.id = newEquipoRef.id

    try{
      await runTransaction(this.firestore, async(transaction) => {
        transaction.set(newEquipoRef, data);
        transaction.set(perfilEquipoRef , {
          cargo: 'Capitan',
          pertenece: true
        })

        const jugador: EquipoJugador = {
          id: perfilId,
          cargo: 'Capitan',
          pertenece: true
        }
        transaction.set(jugadorRef, jugador)
      });
      return data;
    }catch(error){
      console.error("❌ Error en la transacción de equipo:", error);
      return null;
    }
  }


  getEquipos(): Observable<Equipo[]>{
    const ref = collection(this.firestore, this.collectionName)

    return collectionData(ref, {idField: 'id'}) as Observable<Equipo[]>
  }

  getEquipo(id: string): Observable<Equipo>{
    const ref = doc(this.firestore,`${this.collectionName}/${id}`)

    return docData(ref, {idField: 'id'}) as Observable<Equipo>
  }

  async getCapitan(idEquipo: string): Promise<Perfil | null>{
    const refEquipo = collection(this.firestore, `equipo/${idEquipo}/jugador`)

    const q = query(
        refEquipo,
        where('cargo','==','Capitan'),
        where('pertenece','==',true)
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty){
      console.log("❌❌ No encuentra la persona con cargo")

      return null
    }

    const idCapitan = snapshot.docs[0].id 


    try {
      const perfil = await this.perfilService.getPerfilByUID(idCapitan)
      return perfil
    } catch (error) {
      console.log("❌❌ Error desconocido equipo.service.ts - getCapitan() - catch: ",error)
      return null
    }
  }

  async getCocapitanes(idEquipo: string): Promise<Perfil[]>{
    const refEquipo = collection(this.firestore, `equipo/${idEquipo}/jugador`)

    const q = query(
        refEquipo,
        where('cargo','==','Cocapitan'),
        where('pertenece','==',true)
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty){
      console.log("❌❌ No encuentra cocapitanes")

      return []
    }

    const cocapitanes: Perfil[] = [];

    try {
      for(const doc of snapshot.docs){
        const perfil = await this.perfilService.getPerfilByUID(doc.id);
        if(perfil){
          cocapitanes.push(perfil)
        }
      }

      return cocapitanes

    } catch (error) {
      console.log("❌❌ Error desconocido equipo.service.ts - getCocapitanes() - catch: ",error)
      return []
    }
  }

  async getJugadores(idEquipo: string): Promise<Perfil[]>{
    const refEquipo = collection(this.firestore, `equipo/${idEquipo}/jugador`)

    const q = query(
        refEquipo,
        where('cargo','==','Jugador'),
        where('pertenece','==',true)
    )
    const snapshot = await getDocs(q)

    if (snapshot.empty){
      console.log("❌❌ No encuentra jugadores")

      return []
    }

    const jugadores: Perfil[] = [];

    try {
      for(const doc of snapshot.docs){
        const perfil = await this.perfilService.getPerfilByUID(doc.id);
        if(perfil){
          jugadores.push(perfil)
        }
      }

      return jugadores

    } catch (error) {
      console.log("❌❌ Error desconocido equipo.service.ts - getJugadores() - catch: ",error)
      return []
    }
  }


  async getJugadoresPorCargo(idEquipo: string): Promise<{
    capitan: Perfil | null,
    cocapitanes: Perfil[],
    jugadores: Perfil[]
  }>{

    const jugadoresRef = collection(this.firestore, `equipo/${idEquipo}/jugador`)

    const q = query(
      jugadoresRef,
      where('pertenece', '==', true)
    )

    const snapShot = await getDocs(q)

    if(snapShot.empty){
      console.log("❌❌ No encuentra jugadores")
      return {
        capitan: null,
        cocapitanes: [],
        jugadores: []
      }
    }


    const capitanes: Perfil[] = []
    const cocapitanes: Perfil[] = []
    const jugadores: Perfil[] = []
    
    try {
      const perfiles = await Promise.all(
        snapShot.docs.map(async doc => {
          const perfil = await this.perfilService.getPerfilByUID(doc.id);

          if(!perfil) return null;

          const cargo = doc.data()?.['cargo'];

          switch(cargo){
            case 'Capitan':
              capitanes.push(perfil)
              break;
            case 'Cocapitan':
              cocapitanes.push(perfil)
              break;
            default:
              jugadores.push(perfil)
          }

          return perfil
        })
      );

      return {
        capitan: capitanes[0] || null,
        cocapitanes,
        jugadores
      }
      
    } catch (error) {
      console.log("❌❌ Error desconocido equipo.service.ts - getJugadoresPorCargo() - catch: ",error)
      return {
        capitan: null,
        cocapitanes: [],
        jugadores: []
      }
    }
  }

  async getStatsEquipo(equipoId: string): Promise<EquipoEstadistica | null>{
    try {
      const ref = collection(this.firestore, `${this.collectionName}/${equipoId}/estadistica`)

      const docSnap = await getDocs(ref)

      if(!docSnap.empty){
        const data: EquipoEstadistica | any = docSnap.docs[0].data()

        return data
      }

      return null
    } catch (error) {
      console.log("❌❌ ERROR: Hay un error buscando las estadisticas")
      return null
    }
  }

  async countJugadoresEquipo(equipoId: string): Promise<number>{
    const ref = collection(this.firestore, `${this.collectionName}/${equipoId}/jugador`)
    const q = query(ref, where('pertenece', '==', true))
    const snapshot = await getDocs(q)

    return snapshot.size;
  }


  /** METODO QUE BUSCA SI UN JUGADOR PERTENECE AL EQUIPO (SI PERTENECE DEVUELVE SU DATA (equipo-jugador.ts))*/
  async getJugadorQuePertenece(equipoID: string, uid: string): Promise<EquipoJugador | null>{
    const ref = collection(this.firestore, `equipo/${equipoID}/jugador`)
    const q = query(ref,
      where('pertenece','==',true),
      where('id','==',uid)
    )

    const snapshot = await getDocs(q)

    if(snapshot.empty) return null

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    } as EquipoJugador
  }


  /** METODO QUE TRAE TODOS LOS EQUIPOS DONDE PERTENECE EL JUGADOR */
  async perteneceAEquipo(perfilID: string){
    const ref = collection(this.firestore, `perfil/${perfilID}/equipo`)
    const q = query(ref, where('pertenece','==',true))
    const snapShot = await getDocs(q)

    const data = {
      id: snapShot.docs[0].id,
      ...snapShot.docs[0].data()
    }

    return data
  }


}
