import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider, authState } from '@angular/fire/auth';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) { }

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
