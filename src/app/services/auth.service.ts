import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, authState, onAuthStateChanged, User, signInWithCredential } from '@angular/fire/auth';
import { Usuario } from '../interfaces/usuario';
import { Firestore } from '@angular/fire/firestore';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private uid: string | null = null;

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged( this.auth, async(user: User | null) => {
      if(user){
        this.uid = user.uid;
      }else{
        this.uid = null
      }
    })
  }

  getUid(): string | null{
    return this.uid
  }

  register(usuario: Usuario){
    return createUserWithEmailAndPassword(this.auth, usuario.correo, usuario.password);
  }

  login(usuario: Usuario){
    return signInWithEmailAndPassword(this.auth, usuario.correo, usuario.password)
  }

  logout(){
    return signOut(this.auth);
  }

  async loginWithGoogle(){

    const isNative = Capacitor.getPlatform() === 'web';

    if(!isNative){
      const googleUser = await GoogleAuth.signIn()
      const credential = GoogleAuthProvider.credential(googleUser.authentication.idToken);

      return signInWithCredential(this.auth, credential)
    }else{
      return signInWithPopup(this.auth, new GoogleAuthProvider())
    }

    
  }

  getAuth(){
    return authState(this.auth)
  }
}
