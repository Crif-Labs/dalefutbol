import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { getMessaging, getToken, onMessage } from '@angular/fire/messaging';
import { FirebaseMessaging } from '@capacitor-firebase/messaging';
import { Capacitor } from '@capacitor/core';
import { METHODS } from 'http';
@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {

  private messaging: any

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if(isPlatformBrowser(this.platformId)){
      this.messaging = getMessaging()
    }
  }

  getMessagingInstance(){
    return this.messaging
  }

  async requestPermissionAndSave(): Promise<string | null>{

    if(!isPlatformBrowser(this.platformId)){
      console.log('⚠️ FCM deshabilitado en SSR');
      return null
    }

    try {
      let token: string | null = null;
      console.log(Capacitor.getPlatform())

      if(Capacitor.getPlatform() === 'web'){
        token = await getToken(this.messaging, {vapidKey: 'BIsHvYpZENe_GtAPcqHEvd6nt87mibh7QZHdgZv_pPt8T_KFppkI1eZ9gw0iqrEKo1NKLZT2d1p_xNSYvZAyr3Y'});

        console.log('✅ Token Web FCM: ', token)
      }else{
        const result = await FirebaseMessaging.getToken();
        token = result.token ?? null;
        console.log('✅ Token Movil FCM: ',token)
      }

      if(token){
        await this.saveTokenToFirestore(token);
      }

      return token;

    } catch (error) {
      console.error('❌ Error solicitando permisos de notificacion: ', error) 
      return null
    }
  }

  private async saveTokenToFirestore(token: string){
    const user = this.auth.currentUser;
    if(!user){
      console.warn('❌ No se encuentra usuario, no se puede guardar el token')
      return;
    }

    const perfilRef = doc(this.firestore, `perfil/${user.uid}`);

    await setDoc(perfilRef, {fcmToken: token}, {merge: true});

    console.log(`Token guardado en Firestore -> perfil/${user.uid}`)
  }

  listenMessages(): {title: string, body: string} | undefined | any {
    if(!isPlatformBrowser(this.platformId)){
      console.log('⚠️ Listener FCM deshablitado en SSR')
    }

    if(Capacitor.getPlatform() === 'web'){
      onMessage(this.messaging, (payload) => {
        console.log('Notificacion recibidia en Web: ', payload)
      })
    }else{
      FirebaseMessaging.addListener('notificationReceived', (event) => {
        console.log('Notificacion recibida en Movil: ', event)
      })
    }
  }

  // async sendReservaStatusnotification(fcmToken: string, estado: 'Confirmada' | 'Rechazada'){
  //   if(!fcmToken) return;

  //   const payload = {
  //     notification: {
  //       title: 'Tu reserva',
  //       body: `Tu reserva ha sido ${estado}`
  //     },
  //     to: fcmToken
  //   }

  //   if(Capacitor.getPlatform() === 'web'){
  //     await fetch('https://fcm.googleapis.com/fcm/send'), {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'key=xxx'
  //       },
  //       body: JSON.stringify(payload)
  //     }
  //   }else{
  //     // Esta es la parte movil
  //   }
  // }
}
