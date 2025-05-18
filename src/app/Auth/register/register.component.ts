import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterAppComponent } from "../../shared/footer-app/footer-app.component";
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Usuario } from '../../interfaces/usuario';
import { ModalComponent } from "../../shared/modal/modal.component";
import { Modal } from '../../interfaces/modal';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FooterAppComponent, ReactiveFormsModule, ModalComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  validCorreo: boolean = true;
  validPassword: boolean = true;
  validRepPass: boolean = true;

  formRegister: FormGroup;

  showPass: boolean = false;
  showModal: boolean = true;

  modalData!: Modal 

  inputForm = [
    {
      name: 'correo',
      type: 'email',
      placeholder: 'Ingrese Correo',
      required: 'true',
      icon: 'fa-regular fa-at',
      error: 'El correo es inválido'
    },    
    {
      name: 'password',
      type: 'password',
      placeholder: 'Ingrese Contraseña',
      required: 'true',
      icon: 'fa-solid fa-key',
      error: 'La contraseña es inválido'
    },    
    {
      name: 'repPass',
      type: 'password',
      placeholder: 'Repita Contraseña',
      required: 'true',
      icon: 'fa-solid fa-key',
      error: ''
    }
  ]

  constructor(private router: Router, private authService: AuthService){
    this.showModal = false;
    this.formRegister = new FormGroup({
      correo: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.minLength(6), Validators.maxLength(8), Validators.required]),
      repPass: new FormControl('', [Validators.required])
    })
  }

  validateForm(){

    if(!this.formRegister.controls['correo'].valid){
      this.modalData = {
        title: 'Error en Formulario',
        message: 'El correo ingresado no es valido',
        loadModal: false,
        closeButton: true
      }
      this.showModal = true
    }else if(!this.formRegister.controls['password'].valid){
      
      this.modalData = {
        title: 'Error en Formulario',
        message: 'La contrasena no es valida; minimo 6 digitos, maximo 8 digitos',
        loadModal: false,
        closeButton: true
      }
      this.showModal = true
    }else if(!this.formRegister.controls['repPass'].valid || this.formRegister.controls['password'].value !== this.formRegister.controls['repPass'].value){
      this.modalData = {
        title: 'Error en Formulario',
        message: 'Las contrasenas no coinciden, por favor verificar',
        loadModal: false,
        closeButton: true
      }
      this.showModal = true
    }else{
      this.modalData = {
        title: 'Ingresando el registro',
        message: '',
        loadModal: true,
        closeButton: true
      }
      this.showModal = true

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

          this.authService.login(usuario)
            .then(
              () => {
                this.router.navigate(['/register-profile'])
              }
            ).catch(
              (error) => {
                this.showModal = false
      
                this.modalData = {
                  title: 'Error al Iniciar Sesion',
                  message: error.code,
                  loadModal: false,
                  closeButton: true
                }
                this.showModal = true
              }
            )
        }
      ).catch(
        (error) => {
          this.showModal = false

          let message = ''
          switch(error.code){
            case 'auth/email-already-in-use':
              message = 'El correo ya esta registrado'
              break;
            case 'auth/invalid-email':
              message = 'Correo invalido'
              break;
            default:
              message = 'Ocurrio un error inesperado'
              break;
          }

          this.modalData = {
            title: 'Error en el registro',
            message: message,
            loadModal: false,
            closeButton: true
          }
          this.showModal = true
        }
      )   
  }

  showPassControl(){

    this.showPass = !this.showPass

    if(this.showPass){
      this.inputForm[1].type = 'text'
      this.inputForm[2].type = 'text'
    }else{
      this.inputForm[1].type = 'password'
      this.inputForm[2].type = 'password'
    }
  }

  
  showModalMetodo(tipo: 'loading' | 'message'){

    switch(tipo){
      case 'loading':


        break;
      case 'message':
        this.showModal = true
        break;
      default:
        break;
    }

  }

  closeModal() {
    this.showModal = false;
  }

  backLogin(){
    this.router.navigate(['/login'])
  }

}
