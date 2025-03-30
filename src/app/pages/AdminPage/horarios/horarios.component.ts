import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComunaService } from '../../../services/comuna.service';
import { Comuna } from '../../../interfaces/comuna';
import { CanchaService } from '../../../services/cancha.service';
import { Cancha } from '../../../interfaces/cancha';
import { Horario } from '../../../interfaces/horario';
import { HorarioService } from '../../../services/horario.service';

@Component({
  selector: 'app-horarios',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './horarios.component.html',
  styleUrl: './horarios.component.scss'
})
export class HorariosComponent {

  inputHorario = [
    {
      control: 'hora_inicio',
      type: 'time',
      text: 'Hora de Inicio:',
      icon: ''
    },
    {
      control: 'hora_fin',
      type: 'time',
      text: 'Hora Fin:',
      icon: ''
    },
    {
      control: 'dia',
      type: 'date',
      text: 'Seleccione dia:',
      icon: ''
    },
  ]

  listComunas: Comuna[] = []
  listCancha: Cancha[] = []
  selectedCanchas: Cancha[] = []
  comunaSelected = '-- Comuna --'
  formHorario: FormGroup
  booleanComuna: boolean


  messageModal: {
    title: "Error!" | "Genial!",
    message: string,
    button: "alert" | "success",
  } = {
    title: "Error!",
    message: "",
    button: "alert"
  }

  constructor(private comunaService: ComunaService, private canchaService: CanchaService, private horarioService: HorarioService){
    this.booleanComuna = true

    this.formHorario = new FormGroup({
      hora_inicio: new FormControl('', Validators.required),
      hora_fin: new FormControl('', Validators.required),
      dia: new FormControl('', Validators.required)
    })

    this.listComunas = []
    comunaService.getComunas().subscribe(res => {
      this.listComunas = res.sort( (a,b) => a.nombre.localeCompare(b.nombre))
    })
  }

  comunaList: boolean = false

  selectComuna(){
    this.listCancha = []
    this.selectedCanchas = []
    this.canchaService.getCanchasByComunas(this.comunaSelected).subscribe(res => {
      if(res.length == 0){
        this.comunaList = true
        this.booleanComuna = true
      }else{
        this.listCancha = res    
        this.comunaList = false
        this.booleanComuna = false
      }
    })


  }

  toggleCancha(cancha: Cancha, event: any) {
    if (event.target.checked) {
      this.selectedCanchas.push(cancha); // Agrega si está seleccionado
    } else {
      this.selectedCanchas = this.selectedCanchas.filter(c => c.id !== cancha.id); // Elimina si se deselecciona
    }
  }

  addHorario(){

    const horario: Horario = {
      hora_inicio: this.formHorario.value.hora_inicio,
      hora_fin: this.formHorario.value.hora_fin,
      dia: this.formHorario.value.dia,
    }

    console.log(horario)

    if(this.formHorario.valid && this.selectedCanchas.length != 0){

      /** CONFIRMAMOS SI EXISTEN HORARIOS REGISTRADOS */
      this.horarioService.getHorarioDiaHora(horario.dia, horario.hora_inicio, horario.hora_fin)
      .subscribe(res => {
        if(res.length){
          for(let i =0;this.selectedCanchas.length; i++){
            this.horarioService.addCanchaToHorario(this.selectedCanchas[i], String(res[0].id))
              .then(res => console.log("Cancha ingresada a horario"))
              .catch(error => this.messageModal = {
                title: 'Error!',
                message: "TRUE: (addCanchaToHorario) Cancha no ingresada: "+error,
                button: 'alert'
              }
            
            )
          }

          console.log("Hay datos: "+res[0].id)
        }else{

          /** SI NO EXISTEN DATOS, CREAMOS UNA NUEVA COLECCION CON LAS CANCHAS SELECCIONDAS */
          this.horarioService.addHorario(horario)
            .then( res => {
              console.log("Ingresado el horario: ",res.id)

              for(let i =0;this.selectedCanchas.length; i++){
                this.horarioService.addCanchaToHorario(this.selectedCanchas[i], String(res.id))
                  .then(res => console.log("Cancha ingresada a horario"))
                  .catch(error => this.messageModal = {
                    title: 'Error!',
                    message: "FALSE: (addCanchaToHorario) Cancha no ingresada: "+error,
                    button: 'alert'
                  }
                
                )
              }
              
            }).catch(
              error => this.messageModal = {
                  title: 'Error!',
                  message: "(addHorario) No se ha ingresado el horario: "+error,
                  button: 'alert'
                }
              
            )
              }
            })

    }


  }


  closeModal(){
    if(this.messageModal.button == "alert"){


    }else{

    }

    this.booleanComuna = true

    this.formHorario = new FormGroup({
      hora_inicio: new FormControl('', Validators.required),
      hora_fin: new FormControl('', Validators.required),
      dia: new FormControl('', Validators.required)
    })

    
    this.comunaSelected = '-- Comuna --'
  }

}
