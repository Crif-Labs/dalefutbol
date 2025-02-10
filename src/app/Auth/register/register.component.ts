import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterAppComponent } from "../../shared/footer-app/footer-app.component";
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FooterAppComponent, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  validCorreo: boolean = true;
  validPassword: boolean = true;
  validRepPass: boolean = true;

  formRegister: FormGroup;

  constructor(private router: Router, private authService: AuthService){
    this.formRegister = new FormGroup({
      correo: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.required]),
      repPass: new FormControl('', [Validators.required])
    })
  }

  validateForm(){
    this.validCorreo = this.formRegister.controls['correo'].valid
    this.validPassword = this.formRegister.controls['password'].valid

    if(this.formRegister.controls['password'].value != this.formRegister.controls['repPass'].value){
      this.validRepPass = false
    }else{
      this.validRepPass = true
    }

    if(this.formRegister.valid == true && this.validRepPass == true){
      const usuario: Usuario = {
        correo: this.formRegister.controls['correo'].value,
        password: this.formRegister.controls['password'].value
      }

      this.onRegister(usuario)
    }

  }

  onRegister(usuario: Usuario){
    
    this.authService.register(usuario)
      .then(
        () => {
          console.log("Usuario Registrado: ",usuario.correo)

          this.authService.login(usuario)
            .then(
              () => {
                this.router.navigate(['/register-profile'])
              }
            ).catch(
              () => {
                console.log("El Usuario fue registrado, mas no ha podido iniciar sesion")
              }
            )
        }
      ).catch(
        (error) => {
          console.log("Usuario no fue registrado")
          console.log(error)
        }
      )

    
  }

  backLogin(){
    this.router.navigate(['/login'])
  }

}
