import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { doc, Firestore, serverTimestamp, updateDoc } from '@angular/fire/firestore';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FcmTokenService {

  private platformID= inject(PLATFORM_ID);
  private messaging = inject(Messaging);
  

  constructor(private firestore: Firestore) { }

  requestPermissionAndRegister(uid: string, device = 'web'): Observable<string>{
    if(!isPlatformBrowser(this.platformID)){
      return from(Promise.reject('SSR/no-browser'));
    }

    return from(Notification.requestPermission().then( async (perm) => {
      if(perm !== 'granted') throw new Error('❌ permission-denied');

      const token = await getToken(this.messaging, {vapidKey: 'BIsHvYpZENe_GtAPcqHEvd6nt87mibh7QZHdgZv_pPt8T_KFppkI1eZ9gw0iqrEKo1NKLZT2d1p_xNSYvZAyr3Y'});
      const ref = doc(this.firestore, `perfil/${uid}`);
      const tokenField = `fcmToken.${token}`;
      await updateDoc(ref, {
        [tokenField]: {
          platform: 'web',
          device,
          createdAt: serverTimestamp(),
          lastUsedAt: serverTimestamp()
        }
      });
      return token;
    }));
  }

  listenForegroundMessages(cb: (payload: any) => void){
    if(isPlatformBrowser(this.platformID)){
      onMessage(this.messaging, (payload) => cb(payload))
    }
  }
}
