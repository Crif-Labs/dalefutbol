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
import { AuthService } from '../../../services/auth.service';
import { ModalSelectComponent } from "../../../shared/ModalDir/modal-select/modal-select.component";
import { ModalResponseComponent } from "../../../shared/ModalDir/modal-response/modal-response.component";
import { ModalResponse } from '../../../interfaces/modal-response';
import { ModalLoadingComponent } from "../../../shared/ModalDir/modal-loading/modal-loading.component";
import { OrdenarHorariosPipe } from '../../../pipes/ordenar-horarios.pipe';

registerLocaleData(localeEs, 'es-ES');

@Component({
  selector: 'app-partidos',
  imports: [DatePipe, LoadingPageComponent, CommonModule, FormsModule, ModalSelectComponent, ModalResponseComponent, ModalLoadingComponent, OrdenarHorariosPipe],
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
  comunaSelectList: string[] = []
  listReservaFromPerfil: Reserva2[] = []
  listHoras: String[] = []
  hora_selected: string = ''


  showModalLoading: boolean = false

  constructor(private route: Router, 
    private perfilService: PerfilService, 
    private comunaService: ComunaService,
    private horarioService: HorarioService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private reservaService: ReservaService,
    private authService: AuthService
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

    // console.log(this.authService.getUid())

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

    const uid = this.authService.getUid()
    let aux_comuna: any

    if(!uid){
      console.log('Error al encontrar uid')
    }else{
      await this.perfilService.getComunaOfPerfil(uid)
      .then((res) => {
        this.comuna = res
        this.comunaSelected = res
      })
    }
  }

  getComunaByName(){
    this.comunaService.getComunaByNombre(this.comuna)
      .then( res => {
        console.log(res)
      }).catch( error => console.log(error))
  }


  listHorarioCancha: {
      horario: Horario,
      canchas: Cancha[]
    }[] = []

  showModalResponse: boolean = false
  modalResponse: ModalResponse = {
      title: '',
      subtitle: '',
      message: '',
      textButtonSuccess: 'Aceptar',
      textButtonClose: 'Cerrar'
    }
  showButtonCloseModal: boolean = false

  actionModalResponse(event: any){
    this.showModalResponse = !event    
  }

  async getHorarios(){
    const date = formatDate(this.today, 'yyyy-MM-dd', 'en-US')
    let cancha_list: Cancha[] | any = []
    let horario_final: Horario;
    this.listHorarioCancha = []
    this.listHoras = []
    const perfilFb = JSON.parse(String(this.localStorageService.getItem('perfil')))//await localStorage.getItem('perfil');
    this.showModalLoading=true

    ;(await this.horarioService.getCanchaPorDiaYHorario(date,this.comuna))
      .subscribe(res => {
        if(res.length === 0){
          this.modalResponse = {
            title: 'Ups!',
            subtitle: 'No tenemos partidos para esta comuna hoy 😣',
            message: 'Puedes navegar por la app, ver otras comunas, tus reservas, tus estadisticas, etc',
            textButtonSuccess: 'Aceptar',
            textButtonClose: 'Cerrar'
          }

          this.getComunasWithReservas(date);

        }else{
          this.showSugerenciaComuna = false
          for(const data of res){
            this.listHoras.push(data.horario.hora_inicio)
          }
          this.listHoras.sort()
          this.listHorarioCancha = res
          
          this.showModalLoading = false
        }
      })

  }

  showSugerenciaComuna: boolean = false
  listComunasSugeridas: string[] = []

  async getComunasWithReservas(dia: string){

    await this.horarioService.getComunasConCanchasDisponible(dia)
      .then(res => this.listComunasSugeridas = res)
      .catch(error => console.log(error))
    this.showModalLoading = false
    this.showModalResponse = true
    this.showSugerenciaComuna = true
  }

  async redirecToReserva(horario: Horario, cancha: Cancha){ 
    await this.sessionStorageService.setItem('horario', JSON.stringify(horario))
    await this.sessionStorageService.setItem('cancha', JSON.stringify(cancha))


    this.route.navigate(['/user','reservas-check-in'])
  }

  async getComunasList(){
    try{
      await this.comunaService.getComunas()
        .subscribe( res => {
          this.comunaList = res
          this.comunaList.sort((a,b) => a.nombre.localeCompare(b.nombre))
          this.comunaSelectList = this.comunaList.map(c => c.nombre)
        })
      
    }catch(error){
      console.log(error)
    }
  }

  showModalSelect: boolean = false


  getComunaSelect(comuna: string){
    this.comunaSelected = comuna;
    this.changeComuna(comuna)

    this.actionModal(false)
  }

  actionModal(action: boolean){
    this.showModalSelect = action
  }

  getHorarioPorHora(hora: String){
    if(hora == this.hora_selected)
      this.hora_selected = ''
    else{
      this.hora_selected = `${hora}`
    }
  }

  redirectToMisReservas(){
    this.route.navigate(['/user','mis-reservas'])
  }


}

