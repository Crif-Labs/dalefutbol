import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, getDocs, query, runTransaction, where } from '@angular/fire/firestore';
import { PerfilService } from './perfil.service';
import { EquipoService } from './equipo.service';
import { Solicitudes } from '../interfaces/solicitudes';
import { EquipoJugador } from '../interfaces/equipo-jugador';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  constructor(private firestore: Firestore, private perfilService: PerfilService, private equipoService: EquipoService) { }

  async addSolicitudIngreso(idEquipo: string, idPerfil: string){

    const equipoRef = collection(this.firestore, `equipo/${idEquipo}/solicitudes`)
    const newEquipoRef = doc(equipoRef)
    const perfilRef = doc(this.firestore, `perfil/${idPerfil}/solicitudes/${newEquipoRef.id}`)

    const solicitud: Solicitudes = {
      id: newEquipoRef.id,
      estado: 'En proceso',
      idEquipo: idEquipo,
      idPerfil: idPerfil
    }

    try {
      await runTransaction(this.firestore, async(transaction) => {
        transaction.set(newEquipoRef, solicitud);
        transaction.set(perfilRef, solicitud)
      })

      return 'Exito ✅✅'
    } catch (error) {
      console.log('❌ Error: ',error)
      return null
    }
  }

  async tieneSolicitudEnProceso(idEquipo: string, idPerfil: string): Promise<boolean>{
    const solicitudesref = collection(this.firestore, `perfil/${idPerfil}/solicitudes/`)
    const q = query(
      solicitudesref,
      where('idEquipo','==',idEquipo),
      where('estado','==','En proceso')
    )

    try {
      const snapShot = await getDocs(q);
      return !snapShot.empty
    } catch (error) {
      console.log('❌ Error: ',error)
      return false
    }
  } 

  async getSolicitudesEnProcesoEquipo(idEquipo: string): Promise<any[]>{
    const solicitudesRef = collection(this.firestore, `equipo/${idEquipo}/solicitudes`);
    const q = query(
      solicitudesRef,
      where('estado','==','En proceso')
    );
    const resultado: any[] = []

    try {
      const snapshot = await getDocs(q);

      for(const docSnap of snapshot.docs){
        const solicitud = docSnap.data();
        const idPerfil = solicitud['idPerfil'];

        const perfilDocRef = doc(this.firestore, `perfil/${idPerfil}`)
        const perfilSnap = await getDoc(perfilDocRef)

        if(perfilSnap.exists()){
          const perfilData = perfilSnap.data();
          resultado.push({
            idPerfil: idPerfil,
            idEquipo: idEquipo,
            nombre: perfilData['nombre'],
            apellido: perfilData['apellido'],
            posicion: perfilData['posicion'],
            comuna: perfilData['comuna'],
            estado: solicitud['estado'],
            idSolicitud: solicitud['id'],
          })
        }
      }

      return resultado

    } catch (error) {
      console.log('❌ Error: ', error)
      return []
    }
  }

  async getSolicitudesEnProcesoJugador(idPerfil: string): Promise<any[]>{
    const solicitudesRef = collection(this.firestore, `perfil/${idPerfil}/solicitudes`)
    const q = query(
      solicitudesRef,
      where('estado','==','En proceso')
    );
    const resultado: any[] = []

    try {
      const snapShot = await getDocs(q)

      for(const docSnap of snapShot.docs){
        const solicitud = docSnap.data();
        const idEquipo = solicitud['idEquipo']

        const equipoRef = doc(this.firestore, `equipo/${idEquipo}`)
        const equipoSnap = await getDoc(equipoRef)

        if(equipoSnap.exists()){
          const equipoData = equipoSnap.data();
          resultado.push({
            idPerfil: idPerfil,
            idEquipo: idEquipo,
            nombre: equipoData['nombre'],
            idSolicitud: solicitud['id']
          })
        }
      }

      return resultado
    } catch (error) {
      console.log('❌ Error: ',error)
      return []
    }
  }

  async aceptarSolicitudYAgregarjugador(idEquipo: string, idPerfil: string, idSolicitud: string): Promise<boolean>{
    const equipoSolicitudRef = doc(this.firestore, `equipo/${idEquipo}/solicitudes/${idSolicitud}`)
    const perfilSolicitudRef = doc(this.firestore, `perfil/${idPerfil}/solicitudes/${idSolicitud}`)

    const jugadorRef = doc(this.firestore, `equipo/${idEquipo}/jugador/${idPerfil}`)
    const equipoRef = doc(this.firestore, `perfil/${idPerfil}/equipo/${idEquipo}`)

    try {
      await runTransaction(this.firestore, async(transaction) => {
        const equipoSnap = await transaction.get(equipoSolicitudRef)
        const perfilSnap = await transaction.get(perfilSolicitudRef)

        if(!equipoSnap.exists() || !perfilSnap.exists())
          throw new Error('❌ Una o ambas solicitudes no existen.')

        transaction.update(equipoSolicitudRef, {estado: 'Aprobada'})
        transaction.update(perfilSolicitudRef, {estado: 'Aprobada'})


        transaction.set(jugadorRef, {
          id: idPerfil,
          cargo: 'Jugador',
          pertenece: true
        })
        transaction.set(equipoRef, {
          id: idEquipo,
          cargo: 'Jugador',
          pertenece: true
        })

      });

      return true
    } catch (error) {
      console.log('❌ Error: ', error)
      return false
    }
  }

  async rechazarSolicitud(idEquipo: string, idPerfil: string, idSolicitud: string): Promise<boolean>{

    const equipoSolicitudRef = doc(this.firestore, `equipo/${idEquipo}/solicitudes/${idSolicitud}`);
    const perfilSolicitudRef = doc(this.firestore, `perfil/${idPerfil}/solicitudes/${idSolicitud}`)

    try {

      await runTransaction(this.firestore, async(transaction) => {
        const equipoSnap = await transaction.get(equipoSolicitudRef)
        const perfilSnap = await transaction.get(perfilSolicitudRef)

        if(!equipoSnap.exists() || !perfilSnap.exists())
          throw new Error('❌ Una o ambas solicitudes no existen.')

        transaction.update(equipoSolicitudRef, {estado: 'Rechazada'})
        transaction.update(perfilSolicitudRef, {estado: 'Rechazada'})
      });

      return true
    } catch (error) {
      console.log('❌ Error: ', error)
      return false
    }
  }
}
