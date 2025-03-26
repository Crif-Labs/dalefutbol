import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Component, Input, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { PerfilService } from '../../../services/perfil.service';
import { LoadingPageComponent } from "../../../shared/loading-page/loading-page.component";
import { ComunaService } from '../../../services/comuna.service';
import { Comuna } from '../../../interfaces/comuna';
import { FormsModule } from '@angular/forms';
import { HorarioService } from '../../../services/horario.service';
import { Cancha } from '../../../interfaces/cancha';
import { Horario } from '../../../interfaces/horario';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SessionStorageService } from '../../../services/session-storage.service';

registerLocaleData(localeEs, 'es-ES');

@Component({
  selector: 'app-partidos',
  imports: [DatePipe, LoadingPageComponent, CommonModule, FormsModule],
  templateUrl: './partidos.component.html',
  styleUrl: './partidos.component.scss',
  providers: [
    {provide: LOCALE_ID, useValue: 'es-ES'}
  ]
})
export class PartidosComponent {

  today: Date;
  comuna: string | any = 'comuna'
  loading: boolean;
  comunaSelected: string = "Comuna";
  comunaList: Comuna[] = []

  constructor(private route: Router, 
    private perfilService: PerfilService, 
    private comunaService: ComunaService,
    private horarioService: HorarioService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService
  ){
    this.today = new Date()

    this.loading = true

    this.onInit()
  }

  async onInit(){
    await this.getComunasList()
    await this.getComuna()
    await this.getHorarios()

    this.loading = await false
  }

  changeComuna(event: any){
    this.comuna = this.comunaSelected

    this.getHorarios()
  }

  async getComuna(){

    const perfilFb = this.localStorageService.getItem('perfil')//await localStorage.getItem('perfil');

    if(perfilFb != null){
      const perfilObj = await JSON.parse(perfilFb)

      // recordemos que lo comentado es lo original
      // this.comuna = perfilObj.comuna
      this.comuna = 'La Florida' //eliminar linea y descomentar linea anterior
      this.comunaSelected = this.comuna
    }
  }

  getComunaByName(){
    this.comunaService.getComunaByNombre(this.comuna)
      .then( res => {
        console.log(res)
      }).catch( error => console.log(error))
  }


  listHorarioCancha: Horario[] = []

  async getHorarios(){
    const date = formatDate(this.today, 'yyyy-MM-dd', 'en-US')
    let cancha_list: Cancha[] | any = []
    let horario_final: Horario;
    this.listHorarioCancha = []


    await this.horarioService.getHorariosHoy(date)
      .then( async res => {   
        
        if(res != null){       
          
          for(let horario of res){

            if(horario.id != undefined){

              this.horarioService.getCanchaHorario(horario.id)
                .subscribe((res) => {

                  cancha_list = []
                  for(let cancha of res){
                    
                    if(cancha.comuna == this.comuna){
                      cancha_list.push(cancha)
                    }
                  }

                  horario_final = {
                    id: horario.id,
                    hora_inicio: horario.hora_inicio,
                    hora_fin: horario.hora_fin,
                    dia: horario.dia,
                    cancha_list: cancha_list
                  }

                  this.listHorarioCancha.push(horario_final)

                })
            }
          }
        }
      }).catch(error => {
        console.log(error)
      })
  }


  async redirecToReserva(horario: Horario, cancha: Cancha){ 
    await this.sessionStorageService.setItem('horario', JSON.stringify(horario))
    await this.sessionStorageService.setItem('cancha', JSON.stringify(cancha))


    // console.log(this.sessionStorageService.getItem('cancha'))

    this.route.navigate(['/reservas-check-in'])
  }

  async getComunasList(){
    try{
      await this.comunaService.getComunas()
        .subscribe( res => {
          this.comunaList = res
          this.comunaList.sort((a,b) => a.nombre.localeCompare(b.nombre))
        })
      
    }catch(error){
      console.log(error)
    }
  }



}

