import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterAppComponent } from "../../shared/footer-app/footer-app.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../interfaces/usuario';
import { AuthService } from '../../services/auth.service';
import { PerfilService } from '../../services/perfil.service';
import { ModalComponent } from '../../shared/modal/modal.component';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FooterAppComponent, ReactiveFormsModule, ModalComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  validCorreo: boolean = true;
  validPassword: boolean = true;
  showModal: boolean = false

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
  }

  titleModal: string = 'Title generico'
  messageModal: string = 'Error generico'
  closeButtonModal: boolean = true


  showAuthErrorModal(message: string){
    this.titleModal = 'Error de Autentificación'
    this.messageModal = message;
    this.closeButtonModal = true
    this.showModal = true;    
  }

  showAuthSuccesModal(){
    this.titleModal = 'Validando Datos...'
    this.messageModal = 'Cargando...'
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
    this.authService.login(usuario)
      .then( async () => {
        
      this.showAuthSuccesModal()
        await this.getAuth();

        const rol: string | any = await this.perfilService.getRolPerfil(this.UID)

        

        if(rol == 'admin'){
          this.router.navigate(['/admin-main'])
        }else if(rol == 'jugador'){
          this.router.navigate(['/user-main'])
        }else{
          this.showAuthErrorModal('Hemos tenido un problema con la identificación. Por favor intente de nuevo')
          this.router.navigate(['/login'])
        }
      }).catch( error => {
        this.showAuthErrorModal('Las credenciales son incorrectas o el usuario no existe.')
      })

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

  closeModal() {
    this.closeButtonModal = true
    this.showModal = false;
  }


  onRegister(){    
    this.router.navigate(['/register'])
  }
}
