import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipo } from '../../../interfaces/equipo';
import { EquipoService } from '../../../services/equipo.service';
import { ModalLoadingComponent } from "../../../shared/ModalDir/modal-loading/modal-loading.component";
import { TimestampPipe } from '../../../pipes/timestamp.pipe';
import { EquipoEstadistica } from '../../../interfaces/equipo-estadistica';
import { Perfil } from '../../../interfaces/perfil';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';
import { ModalResponseComponent } from "../../../shared/ModalDir/modal-response/modal-response.component";
import { SolicitudesService } from '../../../services/solicitudes.service';
import { ModalSolicitudesComponent } from "../../../shared/ModalDir/modal-solicitudes/modal-solicitudes.component";

@Component({
  selector: 'app-equipo-perfil',
  imports: [CommonModule, ModalLoadingComponent, TimestampPipe, ModalResponseComponent, ModalSolicitudesComponent],
  templateUrl: './equipo-perfil.component.html',
  styleUrl: './equipo-perfil.component.scss'
})
export class EquipoPerfilComponent implements OnInit{

  loading: boolean = false

  equipo: Equipo = {
    id: '',
    nombre: '',
    color: '',
    creacion: Timestamp.fromDate(new Date())
  }
  equipoID: string | null
  statsEquipo: EquipoEstadistica = {
    partidos: 0,
    puntos: 0,
    victorias: 0,
    derrotas: 0,
    empates: 0
  }
  capitan: Perfil = {
    nombre: '',
    apellido: '',
    celular: '',
    rol: 'admin',
    id_usuario: ''
  }
  cocapitanes: Perfil[] = []
  jugadores: Perfil[] = []

  perteneceAlEquipo: boolean = false

  menus_equipo = [
    {
      name: 'Solicitudes',
      icon: 'fa-solid fa-people-group'
    },
    {
      name: '',
      icon: 'fa-regular fa-futbol'
    },
    {
      name: 'Stats',
      icon: 'fa-solid fa-chart-simple'
    },
  ]

  menu_noEquipo = [
    {
      name: 'Solicitar Ingreso',
      icon: 'fa-solid fa-people-group'
    },
    {
      name: 'Stats',
      icon: 'fa-solid fa-chart-simple'
    }
  ]


  menu_capitan = [
    {
      name: 'Gestion',
      icon: 'fa-solid fa-people-group'
    },
    {
      name: 'Solicitudes',
      icon: 'fa-solid fa-people-group'
    },
    {
      name: '',
      icon: 'fa-regular fa-futbol'
    },
    {
      name: 'Stats',
      icon: 'fa-solid fa-chart-simple'
    },
    {
      name: 'Soporte',
      icon: 'fa-solid fa-people-group'
    },
  ]

  menu_cocapitan = [
    {
      name: 'Solicitudes',
      icon: 'fa-solid fa-people-group'
    },  
    {
      name: '',
      icon: 'fa-regular fa-futbol'
    },
    {
      name: 'Stats',
      icon: 'fa-solid fa-chart-simple'
    },
    {
      name: 'Soporte',
      icon: 'fa-solid fa-people-group'
    }
  ]

  menu_jugador = [
    {
      name: 'Stats',
      icon: 'fa-solid fa-chart-simple'
    },
    {
      name: 'Soporte',
      icon: 'fa-solid fa-people-group'
    }
  ]


  selectedMenuNoPertenece: number = 3
  selectedMenuEsCapitan: number = 2

  hasNotification: boolean = false

  listSolicitudes: any[] = []

  esCapitan: boolean = false
  esCocapitan: boolean = false
  esJugador: boolean = true

  constructor(private router: Router, private route: ActivatedRoute, private equipoService: EquipoService, private authService: AuthService, private solicitudesService: SolicitudesService){
    this.loading = true

    this.equipoID = route.snapshot.paramMap.get('id')
    const uid = authService.getUid()

    if(this.equipoID && uid){
      const x = equipoService.getJugadorQuePertenece(this.equipoID, uid)
        .then(res => {
          res ? this.perteneceAlEquipo = true : this.perteneceAlEquipo = false
        })

      this.initDatas(this.equipoID)   
    }

    this.loading = false
  }


  async ngOnInit(): Promise<void> {
    this.loading = true;

    this.equipoID = this.route.snapshot.paramMap.get('id')
    const uid = this.authService.getUid();


    if(this.equipoID && uid){
      await this.comprobarSiPertenece(uid, this.equipoID)
      await this.initDatas(this.equipoID)
    }


    this.loading = false
  }

  private async comprobarSiPertenece(uid: string, idEquipo: string): Promise<void>{
    try {
      const pertenece = await this.equipoService.getJugadorQuePertenece(idEquipo, uid)
      this.perteneceAlEquipo = !!pertenece
    } catch (error) {
      console.log('❌ Error: ',error)
      this.perteneceAlEquipo = false
    }
  }


  async initDatas(id: string): Promise<void>{

    try {

      if(this.perteneceAlEquipo){
        this.listSolicitudes = await this.solicitudesService.getSolicitudesEnProcesoEquipo(id)
      }

      this.listSolicitudes.length == 0 ? this.hasNotification = false : this.hasNotification = true
    

      this.equipoService.getEquipo(id).subscribe(res => {this.equipo = res})

      const [stats, jugadoresPorCargo] = await Promise.all([
        this.equipoService.getStatsEquipo(id),
        this.equipoService.getJugadoresPorCargo(id)
      ])

      if(stats)
        this.statsEquipo = stats;

      if(jugadoresPorCargo?.capitan){
        this.capitan = jugadoresPorCargo.capitan
        this.cocapitanes = jugadoresPorCargo.cocapitanes
        this.jugadores = jugadoresPorCargo.jugadores
      }

      const uid = await this.authService.getUid()

      if(uid === this.capitan.id){
        this.esJugador = false
        this.esCapitan = true
      }else{
        for(let cocapitan of this.cocapitanes){
          if(cocapitan.id == uid){
            this.esJugador = false
            this.esCocapitan = true
          }
        }
      }

      
      
    } catch (error) {
      console.log('❌ Error: ', error)
    }
  }

  buttonBack(){
    this.router.navigate(['/user','main','equipo'])
  }


  showSolicitarIngreso: boolean = false
  showSolicitudEnProceso: boolean = false
  showListSolicitudes: boolean = false

  async selectMenu(tipo: string, menu: number){
    const uid = await this.authService.getUid()




    // switch(menu){
    //   case 0:
    //     this.selectedMenu = menu

    //     if(tipo === 'noPertenece'){
    //       this.loading = true

    //       uid && this.equipoID ?
    //         this.addSolicitud(this.equipoID, uid)
    //         : console.log("Error: No ha leido credenciales")
    //     }else{
    //       this.showListSolicitudes = true
    //     }

    //     break;
    //   case 1:   
    //     // this.router.navigate(['/user','main','my-teams'])
    //     this.selectedMenu = menu
    //     break;
    //   case 2:
    //     // this.router.navigate(['/user','main','partidos'])   
    //     this.selectedMenu = menu
    //     break;
    //   case 3:
    //     this.selectedMenu = menu
    //     break;
    //   case 4:
    //     this.selectedMenu = menu
    //     break;
    //   case 5:   
    //     // this.router.navigate(['/user','main','perfil'])
    //     this.selectedMenu = menu
    //     break;
    //   default:
    //     // this.router.navigate(['/user','main','partidos'])
    //     this.selectedMenu = 1
    //     break;
    // }

  }

  async addSolicitud(idEquipo: string, idPerfil: string){    

    if(await this.solicitudesService.tieneSolicitudEnProceso(idEquipo, idPerfil)){
      this.loading = false;
      this.showSolicitudEnProceso = true
    }else{
      await this.solicitudesService.addSolicitudIngreso(idEquipo, idPerfil)
      this.loading = false;
      this.showSolicitarIngreso = true
    }

  }

  getCentroIndex(): number {

    if(this.esCapitan == true){
      return Math.floor(this.menu_capitan.length / 2);  
    }else if(this.esCocapitan == true){
      return 2
    }else{
      return 3
    }
    
  }

  closeSolicitarIngreso(event: boolean, modal: string){

    if(modal == 'solicitarIngreso'){
      this.showSolicitarIngreso = false
      this.selectedMenuNoPertenece = 10
    }else if(modal == 'solicitudEnProceso'){
      this.showSolicitudEnProceso = false
      this.selectedMenuNoPertenece = 10
    }else if(modal == 'listaSolicitudes'){
      this.showListSolicitudes = false
      this.selectedMenuNoPertenece = 10
    }
  }

  eventModalSolicitudes(event: any){
    event.length != 0 ? this.addJugadorToEquipo(event[0]) : this.rejectedJugadorToEquipo() 
  }

  async addJugadorToEquipo(data: any){
    
    this.loading = true
    this.showListSolicitudes = false
    this.selectedMenuNoPertenece = 10

    await this.solicitudesService.aceptarSolicitudYAgregarjugador(data.idEquipo, data.idPerfil, data.idSolicitud) ?
      this.initDatas(data.idEquipo) :
      console.log('Jugador no anadido')
  
      this.loading = false
  }

  async rejectedJugadorToEquipo(){
    console.log('rejected')
  }
}