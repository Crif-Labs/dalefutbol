import { Component } from '@angular/core';
import { WorkingPageComponent } from "../../../shared/working-page/working-page.component";
import { ModalLoadingComponent } from "../../../shared/ModalDir/modal-loading/modal-loading.component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquipoService } from '../../../services/equipo.service';
import { Equipo } from '../../../interfaces/equipo';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { EquipoJugador } from '../../../interfaces/equipo-jugador';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-equipo',
  imports: [CommonModule, ModalLoadingComponent, ReactiveFormsModule, WorkingPageComponent],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.scss'
})
export class EquipoComponent {

  showModalLoading: boolean = false
  selectOption: number = 1

  inputFormCreateEquipo = [
    {
      name: 'nombre',
      type: 'text',
      placeholder: 'Nombre Equipo',
      required: true,
      icon: 'fa-solid fa-signature',
      error: 'Nombre del equipo es necesario'
    },
    {
      name: 'descripcion',
      type: 'text',
      placeholder: 'Descripcion Equipo',
      required: false,
      icon: 'fa-solid fa-pen',
      error: 'Descripcion del equipo es necesario'
    }
  ]

  listEquipo: {
    equipo: Equipo,
    countJugadores: number,
    stats: number
  }[] = []

  uid: string = ''


  formCreateEquipo: FormGroup;

  constructor(private equipoService: EquipoService, private authService: AuthService, private route: Router){
    this.formCreateEquipo = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', []),
      color: new FormControl('--Color Equipo--', [Validators.required])
    })

    const uid = authService.getUid()

    if(uid)
      this.uid = uid


    this.getListEquipo();
    
  }

  getListEquipo(){
    this.equipoService.getEquipos().subscribe(res => {
      const equipos: Equipo[] = res

      equipos.forEach(async equipo => {

        if(equipo.id){
          let cantidad_jugadores: number = 0
          let puntos: number = 0

          await this.equipoService.countJugadoresEquipo(equipo.id)
            .then(res => {
              cantidad_jugadores = res
            })

          await this.equipoService.getStatsEquipo(equipo.id)
            .then(res => {
              if(res)
                puntos = (res.victorias*3)+(res.empates*1)
            })
            
            this.listEquipo.push({
              equipo: equipo,
              countJugadores: cantidad_jugadores,
              stats: puntos
            })
        }
      });
    })
  }

  changeOption(option: number){
    this.selectOption = option
  }

  validateForm(){   

    if(!this.formCreateEquipo.controls['nombre'].valid){
      console.log("❌ ERROR: Falta el nombre del equipo")
    }else if(this.formCreateEquipo.controls['color'].value == '--Color Equipo--'){
      console.log("❌ ERROR: No se ha seleccionado color del equipo")
    }else{
      const uid = this.authService.getUid()
      const localData = new Date()

      if(uid){
        const dataEquipo: Equipo = {
          id:'',
          nombre: this.formCreateEquipo.controls['nombre'].value,
          color: this.formCreateEquipo.controls['color'].value,
          descripcion: this.formCreateEquipo.controls['descripcion'].value,
          creacion: Timestamp.fromDate(localData)
        }

        this.createEquipo(dataEquipo, uid)
      }else{
        console.log("❌ ERROR GRAVE: No se ha encontrado el perfil")
      }


    }
  }

  createEquipo(data: Equipo, uid: string){
    this.equipoService.createEquipo(data, uid)
      .then(res => {
        console.log("✅✅ Ingresado con existo. ")
        console.log(res)
      }).catch(err => {
        console.log("❌❌ Error: ", err)
      })
  }

  redirectToPerfilEquipo(id:string){
    this.route.navigate(['/user','mi-equipo','perfil',id])
  }
}
