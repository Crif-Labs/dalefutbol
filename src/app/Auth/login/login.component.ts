import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterAppComponent } from "../../shared/footer-app/footer-app.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../interfaces/usuario';
import { log } from 'console';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FooterAppComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  validCorreo: boolean = true;
  validPassword: boolean = true;

  formLogin: FormGroup;

  constructor(private router: Router, private authService: AuthService, private perfilService: PerfilService){
    this.formLogin = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }


  validateForm(){

    this.validCorreo = this.formLogin.controls['correo'].value
    this.validPassword = this.formLogin.controls['password'].value

    if(this.formLogin.valid != true){
      console.log("Tenemos un problema houston")
    }else{
      this.onLogin(this.formLogin.value)
    }

  }

  UID: string | any
  async getAuth(){

    await this.authService.getAuth().subscribe( user => {
      this.UID = user?.uid
    })
  }

  onLogin(usuario: Usuario){
    this.authService.login(usuario)
      .then( async () => {
        await this.getAuth();

        const rol: string | any = await this.perfilService.getRolPerfil(this.UID)

        console.log(rol)

        if(rol == 'admin'){
          this.router.navigate(['/admin-main'])
        }else if(rol == 'jugador'){
          this.router.navigate(['/user-main'])
        }else{
          console.log("Error al ingresar o al consultar el rol")
          this.router.navigate(['/login'])
        }
      }).catch( error => console.log(error))

  }

  onLoginWithGoogle(){
    this.authService.loginWithGoogle()
      .then( async () => {
        this.router.navigate(['/user-main'])
      }).catch( () => {
        console.log("error al ingresar con google")
      })
  }

  redirecToPage(){

  }


  onRegister(){    
    this.router.navigate(['/register'])
  }
}
