import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, authState, onAuthStateChanged, User } from '@angular/fire/auth';
import { Usuario } from '../interfaces/usuario';
import { Firestore } from '@angular/fire/firestore';

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

  loginWithGoogle(){
    return signInWithPopup(this.auth, new GoogleAuthProvider())
  }

  getAuth(){
    return authState(this.auth)
  }
}
