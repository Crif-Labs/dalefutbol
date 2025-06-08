import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterAppComponent } from "../../shared/footer-app/footer-app.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../interfaces/usuario';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ModalLoadingComponent } from "../../shared/ModalDir/modal-loading/modal-loading.component";
import { ModalResponseComponent } from "../../shared/ModalDir/modal-response/modal-response.component";
import { BlobOptions } from 'buffer';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FooterAppComponent, ReactiveFormsModule, ModalComponent, ModalResponseComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  validCorreo: boolean = true;
  validPassword: boolean = true;


  titleModal: string = 'Title generico'
  messageModal: string = 'Error generico'
  closeButtonModal: boolean = true
  loadModal: boolean = false
  showModal: boolean = true

  inputForm = [
    {
      name: 'correo',
      type: 'email',
      placeholder: 'Correo',
      required: 'true',
      icon: 'fa-regular fa-at'
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Contraseña',
      required: 'true',
      icon: 'fa-solid fa-lock'
    }
  ]

  formLogin: FormGroup;


  constructor(
    private router: Router, 
    private authService: AuthService, 
    private perfilService: PerfilService
  ){
    this.formLogin = new FormGroup({
      correo: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })

    this.showModal = false;
  }




  showAuthErrorModal(message: string){
    this.titleModal = 'Error de Autentificación'
    this.messageModal = message;
    this.loadModal = false
    this.closeButtonModal = true
    this.showModal = true;    
  }

  showAuthSuccesModal(){
    this.titleModal = 'Validando Datos...'
    this.messageModal = 'Cargando...'
    this.loadModal = true
    this.closeButtonModal = false
    this.showModal = true
  }

  validateForm(){

    this.validCorreo = this.formLogin.controls['correo'].valid
    this.validPassword = this.formLogin.controls['password'].valid

    if(this.formLogin.valid != true){
      
      if(!this.validCorreo && !this.validPassword){
        this.showAuthErrorModal('Correo y Contraseña no válidas')
      }else if(!this.validCorreo){
        this.showAuthErrorModal('Correo no válido')
      }else if(!this.validPassword){
        this.showAuthErrorModal('Contraseña no válida')
      }else{
        this.showAuthErrorModal('Credenciales inválidas, \npor favor reingrese datos')
      }
    }else{
      this.onLogin(this.formLogin.value)
    }

  }

  UID: string | any
  async getAuth(){

    try{
      
      await this.authService.getAuth().subscribe( user => {
        this.UID = user?.uid
      })
    }catch(error){      
      this.showAuthErrorModal('Las credenciales son incorrectas o el usuario no existe.')
    }

    
  }

  onLogin(usuario: Usuario){
    this.showAuthSuccesModal()
    this.authService.login(usuario)
      .then( async () => {
        

        await this.getAuth();

        const rol: string | any = await this.perfilService.getRolPerfil(this.UID)

        

        if(rol == 'admin'){
          this.router.navigate(['/admin-main'])
        }else if(rol == 'jugador'){
          this.router.navigate(['/user'])
        }else{
          /** si llega aca es por que el usuario no tiene un perfil, hay que mandar a hacerselo */
          this.showAuthErrorModal('Hemos tenido un problema con la identificación. Por favor termine de registrarse')
          setTimeout(() => {            
            this.router.navigate(['/register-profile'])
          },2000)
        }
      }).catch( error => {
        this.showAuthErrorModal('Las credenciales son incorrectas o el usuario no existe.')
      })

  }

  error: string = ''
  showError: boolean = false
  onLoginWithGoogle(){
    this.authService.loginWithGoogle()
      .then( () => {
        this.router.navigate(['/user'])
      }).catch( error => {
        this.error = error
        console.log("error al ingresar con google")
        this.showModalError()
      })
  }
  showModalError(){
    this.showError = !this.showError
  }

  redirecToPage(){

  }

  closeModal() {
    this.loadModal = false
    this.closeButtonModal = true
    this.showModal = false;
  }


  onRegister(){    
    this.router.navigate(['/register'])
  }
}
