import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CanchaService } from '../../../services/cancha.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Comuna } from '../../../interfaces/comuna';
import { ComunaService } from '../../../services/comuna.service';
import { Router } from '@angular/router';
import { getDownloadURL, Storage, uploadBytes, ref } from '@angular/fire/storage';
import { SimpleLoadingComponent } from "../../../shared/simple-loading/simple-loading.component";

@Component({
  selector: 'app-canchas',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, SimpleLoadingComponent],
  templateUrl: './canchas.component.html',
  styleUrl: './canchas.component.scss'
})
export class CanchasComponent {
  loadingAddCachan = false
  loadingAddImages = false
  checkAddCancha = false
  checkAddImages = false
  errorPop = false
  messageError = ''

  addImages: boolean = false

  formCancha: FormGroup

  listInputs = [
    {
      control: 'nombre',
      type: 'text',
      text: 'Nombre Cancha:',
      icon: ''
    },
    {
      control: 'capacidad',
      type: 'number',
      text: 'Capacidad Cancha:',
      icon: ''
    },
    {
      control: 'capacidad_equipo',
      type: 'number',
      text: 'Capacidad por Equipo:',
      icon: ''
    },
    // {
    //   control: 'precio',
    //   type: 'number',
    //   text: 'Precio Cancha:',
    //   icon: ''
    // },
    {
      control: 'direccion',
      type: 'text',
      text: 'Direccion Cancha:',
      icon: ''
    },
    // {
    //   control: 'comuna',
    //   type: 'text',
    //   text: 'Comuna Cancha:',
    //   icon: ''
    // }
  ]

  comunaList: Comuna[] = []




  constructor(
    private authService: AuthService, 
    private router: Router,
    private canchaService: CanchaService,
    private comunaService: ComunaService,
    private storage: Storage
  ){

    comunaService.getComunas().subscribe(
      res => {
        this.comunaList = res
        this.comunaList.sort((a,b) => a.nombre.localeCompare(b.nombre))
      }
    )

    this.formCancha = new FormGroup(
      {
        nombre: new FormControl('', Validators.required),
        direccion: new FormControl('', Validators.required),
        comuna: new FormControl('', Validators.required),
        capacidad: new FormControl('', Validators.required),
        capacidad_equipo: new FormControl('', Validators.required),
        // precio: new FormControl('', Validators.required),
        link_image: new FormControl(''),
        // inscritos: new FormControl('0'),
      }

    )

  }

  listImages: string[] = []

  async selectImages($event: any){

    if(this.formCancha.valid){
      this.checkAddCancha = false
      this.loadingAddImages = true
      
      this.listImages = []
  
      for(let i=0; i<$event.target.files.length; i++){
        const file = $event.target.files[i]
        const filePath = `canchas/${this.formCancha.value.nombre}-${this.formCancha.value.comuna}/${file.name}`
        const storageRef = ref(this.storage, filePath)
  
  
        try{
          const snapshot = await uploadBytes(storageRef, file)
          const downLoadURL = await getDownloadURL(snapshot.ref)
  
          this.listImages.push(downLoadURL)
  
          
        }catch(error){
          this.messageError = "Las imagenes no se han guardado :( \n"+error
          this.errorPop = true
        }
      }
  
      this.formCancha.controls['link_image'].setValue(this.listImages)
  

      this.canchaService.addCollection(this.formCancha.value)
        .then( res => {
          console.log("Ingresado")
        }).catch(error => {
          this.messageError = "La cancha no ha sido ingresada :( \n"+error
          this.errorPop = true
        })
  
      this.loadingAddImages = false
      this.checkAddImages = true
    }else{
      console.error("❌ Error con el formulario ❌")
    }        
  }

  errorReset(){
    this.messageError = ''
    this.errorPop = false
  }


  resetForm(){
    this.formCancha.reset()
    // this.formCancha.controls['inscritos'].setValue('0')

    this.loadingAddCachan = false
    this.loadingAddImages = false
    this.checkAddCancha = false
    this.checkAddImages = false

    sessionStorage.removeItem('addCancha')
  }

}
