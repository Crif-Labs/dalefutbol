import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterAppComponent } from "../../shared/footer-app/footer-app.component";
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Console, log } from 'console';
import { Perfil } from '../../interfaces/perfil';
import { PerfilService } from '../../services/perfil.service';
import { Comuna } from '../../interfaces/comuna';
import { ComunaService } from '../../services/comuna.service';
import { Modal } from '../../interfaces/modal';
import { ModalComponent } from "../../shared/modal/modal.component";

@Component({
  selector: 'app-register-profile',
  imports: [CommonModule, FooterAppComponent, ReactiveFormsModule, ModalComponent],
  templateUrl: './register-profile.component.html',
  styleUrl: './register-profile.component.scss'
})
export class RegisterProfileComponent {

  inputForm = [
    {
      name: 'nombre',
      type: 'text',
      placeholder: 'Nombre',
      required: 'true',
      icon: 'fa-solid fa-user',
      error: 'El Nombre es necesario'
    },
    {
      name: 'apellido',
      type: 'text',
      placeholder: 'Apellido',
      required: 'true',
      icon: 'fa-regular fa-user',
      error: 'El Apellido es necesario'
    },
    {
      name: 'telefono',
      type: 'number',
      placeholder: 'Teléfono (+56)',
      required: 'true',
      icon: 'fa-solid fa-mobile-screen',
      error: 'El Teléfono es necesario (9 dígitos)'
    }
  ]

  comunas: Comuna[] = []

  modalData!: Modal
  showModal: boolean = true;
  
  comunaSeleccionada: any;

  validNombre: Boolean = true
  validApellido: Boolean = true
  validTelefono: Boolean = true
  show: boolean = true

  formPerfil: FormGroup;

  constructor(private router: Router, private authService: AuthService, private perfilService: PerfilService, private comunaService: ComunaService){
    this.modalData = {
      title: 'Cargando datos...',
      message: '...',
      loadModal: true,
      closeButton: false
    }


    this.formPerfil = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      telefono: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(9), Validators.maxLength(9)]),
      comuna: new FormControl('--Comuna--', []),
      posicion: new FormControl('--Posición--', [])
    })

    comunaService.getComunas().subscribe(res => {
      this.comunas = res.sort((a,b) => a.nombre.localeCompare(b.nombre))

      this.showModal = false
    })

    
  }

  UID: string | any
  async getAuth(){

    await this.authService.getAuth().subscribe( user => {
      this.UID = user?.uid
    })
  }


  backRegister(){
    this.router.navigate(['/register'])
  }



  async validateForm(){
    let perfil: Perfil;

    this.validNombre = this.formPerfil.controls['nombre'].valid
    this.validApellido = this.formPerfil.controls['apellido'].valid
    this.validTelefono = this.formPerfil.controls['telefono'].valid

    if(this.formPerfil.valid != true){
      this.modalData = {
        title: 'Error en Formulario',
        message: 'Los datos ingresados no son correctos',
        loadModal: false,
        closeButton: true
      }
      this.showModal = true
    }else{
      if(this.formPerfil.controls['comuna'].value == '--Comuna--' || this.formPerfil.controls['comuna'].value == 'No ingresar comuna'){
        this.formPerfil.controls['comuna'].setValue('')
      }

      if(this.formPerfil.controls['posicion'].value == '--Posición--' || this.formPerfil.controls['posicion'].value == 'No ingresar posición'){
        this.formPerfil.controls['posicion'].setValue('')
      }

      await this.getAuth()

      perfil = {
        nombre: this.formPerfil.controls['nombre'].value,
        apellido: this.formPerfil.controls['apellido'].value,
        celular: this.formPerfil.controls['telefono'].value,
        comuna: this.formPerfil.controls['comuna'].value,
        posicion: this.formPerfil.controls['posicion'].value,
        rol: 'jugador',
        id_usuario: this.UID
      }

      this.addNuevoPerfil(perfil)
    }
  }

  addNuevoPerfil(perfil: Perfil){

    this.modalData = {
      title: 'Ingresando su perfil...',
      message: 'Sus datos están siendo registrados',
      loadModal: true,
      closeButton: false
    }
    this.showModal = true

    this.perfilService.addPerfil(perfil)
      .then( () => {

          this.modalData = {
            title: 'Perfil ingresado...',
            message: 'Sus datos han sido registrados.',
            loadModal: true,
            closeButton: false
          }

          setTimeout(() => {
            this.showModal = false
            this.router.navigate(['user-main'])
          }, 1500)          
        }
      ).catch( () => {
        this.modalData = {
          title: 'Error al registrar',
          message: 'Intente nuevamente. Si el problema persiste, intente más tarde o contáctese por Whatsapp',
          loadModal: false,
          closeButton: true
        }
      })
  }

  closeModal() {
    this.showModal = false;
  }



}
