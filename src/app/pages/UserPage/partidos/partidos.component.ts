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
import { ReservaService } from '../../../services/reserva.service';
import { Perfil } from '../../../interfaces/perfil';
import { Reserva2 } from '../../../interfaces/reserva-2';

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
  listReservaFromPerfil: Reserva2[] = []
  listHoras: String[] = []
  hora_selected: string = ''

  constructor(private route: Router, 
    private perfilService: PerfilService, 
    private comunaService: ComunaService,
    private horarioService: HorarioService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private reservaService: ReservaService
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

    // const idPerfil = String(this.localStorageService.getItem('idPerfil'))
    // console.log(idPerfil)

    this.perfilService.getReservaFromPerfil(String(this.localStorageService.getItem('idPerfil')))
    .subscribe(res => this.listReservaFromPerfil = res)

    // console.log(this.listHorarioCancha)
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
      this.comuna = perfilObj.comuna
      // this.comuna = 'La Florida' //eliminar linea y descomentar linea anterior
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
    const perfilFb = JSON.parse(String(this.localStorageService.getItem('perfil')))//await localStorage.getItem('perfil');

    await this.horarioService.getHorariosHoy(date)
      .then( async res => {   
        // console.log("Listado de horarios de hoy: ",res)
        if(res != null){       
          
          this.listHoras = []
          for(let horario of res){

            if(horario.id !== undefined){

              const horarioCopia = { ...horario}

              // this.horarioService.getCanchaHorario(horario.id)
              this.horarioService.getCanchaHorario(String(horarioCopia.id))
                .subscribe((res) => {

                  let cancha_list: Cancha[] = []

                  for(let cancha of res){
                    
                    if(cancha.comuna === this.comuna){  

                      if(!this.listHoras.includes(horarioCopia.hora_inicio)){
                        this.listHoras.push(horarioCopia.hora_inicio)
                        this.listHoras.sort()
                      }
                      
                      // if(this.listHoras.length == 0 ){
                      //   this.listHoras.push(horario.hora_inicio)
                      // }else{
                      //   for(let hora of this.listHoras){
                      //     if(hora != horario.hora_inicio){
                      //       this.listHoras.push(horario.hora_inicio)
                      //       this.listHoras.sort() 
                      //     }
                      //   }
                      // }       
                      
                      this.reservaService.getListReserva(String(horario.id), String(cancha.id))
                        .subscribe(res => {  
                          if(res.length == 0){
                            cancha_list.push(cancha)
                          }else{                      
                            // const reserv: Reserva2 | any = res
                            // let respon: Perfil | any = reserv.reserv

                            // if(respon.rol != 'admin'){

                            // }
                            const yaReservado = res.some(reserva => reserva.responsable?.id === perfilFb.id)
                            if(!yaReservado){
                              cancha_list.push(cancha)
                            }
                            
                            // for(let reserva of res){
                            //   const responsable: Perfil | any = reserva.responsable
                              
                            //   if(responsable.id == perfilFb.id){
                            //     console.log("Ya esta reservado")
                            //   }else{
                            //     cancha_list.push(cancha)
                            //   }
                            // }
                          }
                        })
                      
                    }
                  }

                  

                  const horario_final = {
                    id: horario.id,
                    hora_inicio: horario.hora_inicio,
                    hora_fin: horario.hora_fin,
                    dia: horario.dia,
                    cancha_list: cancha_list
                  }

                  // console.log(horario_final)
                  // this.listHoras = []

                  this.listHorarioCancha.push(horario_final)
                  // this.listHoras = this.listHorarioCancha.map(hora => hora.hora_inicio).sort()

                })
            }
          }          
        }

        // this.listHoras = this.listHorarioCancha.map(hora => hora.hora_inicio).sort()
      }).catch(error => {
        console.log(error)
      })
  }


  async redirecToReserva(horario: Horario, cancha: Cancha){ 
    await this.sessionStorageService.setItem('horario', JSON.stringify(horario))
    await this.sessionStorageService.setItem('cancha', JSON.stringify(cancha))


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

  getHorarioPorHora(hora: String){
    if(hora == this.hora_selected)
      this.hora_selected = ''
    else{
      this.hora_selected = `${hora}`
    }
  }

  redirectToMisReservas(){
    console.log("Estamos yendo a Mis Reservas?")
    this.route.navigate(['/mis-reservas'])
  }


}

