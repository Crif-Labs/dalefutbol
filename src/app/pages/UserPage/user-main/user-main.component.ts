import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Perfil } from '../../../interfaces/perfil';
import { PerfilService } from '../../../services/perfil.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { ModalNotificationComponent } from "../../../shared/ModalDir/modal-notification/modal-notification.component";
import { Notificacion } from '../../../interfaces/notificacion';
import { ModalSupportComponent } from "../../../shared/ModalDir/modal-support/modal-support.component";
import { ReservaService } from '../../../services/reserva.service';
import { Horario } from '../../../interfaces/horario';
import { HorarioService } from '../../../services/horario.service';
import { CanchaService } from '../../../services/cancha.service';
import { ReservaTransferServiceService } from '../../../services/reserva-transfer-service.service';
import { Reserva2 } from '../../../interfaces/reserva-2';
import { Cancha } from '../../../interfaces/cancha';
import { ModalLoadingComponent } from "../../../shared/ModalDir/modal-loading/modal-loading.component";

@Component({
  selector: 'app-user-main',
  imports: [CommonModule, RouterOutlet, ModalNotificationComponent, ModalSupportComponent, ModalLoadingComponent],
  templateUrl: './user-main.component.html',
  styleUrl: './user-main.component.scss'
})
export class UserMainComponent implements OnInit{


  /**
   * con el id_usuario obtenido de Auth
   * sacar el id de la coleccion Perfil
   */
  id_usuario: string | any = 'prueba'//= "hcJa0nlFOBaC9Zbi9zNoxbmFo1i2"
  idPerfil: string = "LDLekObQQxllfp1u3O9U"


  hasNotification: boolean = false
  hasMessage: boolean = false

  listNotificacion: Notificacion[] = []

  showModalNotification: boolean = false
  showModalLoading: boolean = false

  correo: string | any = ''

  menus = [
    {
      name: 'Equipos',
      icon: 'fa-solid fa-people-group'
    },
    {
      name: 'MyTeams',
      icon: 'fa-solid fa-shield-virus'
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
      icon: 'fa-solid fa-circle-info'
    },
  ]

  selectedMenu: number = 3

  uid: string | null = ''
  perfil: Perfil = {
    nombre: '',
    apellido: '',
    celular: '',
    rol: 'admin',
    id_usuario: ''
  }

  constructor(private notificacionService: NotificacionService,
    private authService: AuthService, 
    private router:Router, 
    private perfilService: PerfilService, 
    private lsService: LocalStorageService,
    private reservaService: ReservaService,
    private horarioService: HorarioService,
    private canchaService: CanchaService,
    private reservaTransferService: ReservaTransferServiceService
  ){}


  ngOnInit(): void {
    this.getMenu();

    this.authService.getAuth().subscribe({
      next: (user) => {
        if(user?.uid){
          this.uid = user.uid

          // Obtener perfil y guardarlo en LocalStorage
          this.perfilService.getPerfilByUID(this.uid).then(perfil => {
            if(perfil){
              this.lsService.setItem('idPerfil', String(perfil.id));
              this.lsService.setItem('perfil', JSON.stringify(perfil))
              this.perfil = perfil
            }
          }).catch(err => console.log('Error al obtener el perfil: ', err));

          // Obtener notificaciones
          this.notificacionService.getNotificacionesNoLeidas(this.uid).subscribe({
            next: (res) => {              

              if(res.length != 0){
                this.hasNotification = true
                this.listNotificacion = res
              }else{
                this.hasNotification = false
                this.listNotificacion = []
              }
            },
            error: (err) => console.error('Error al obtener notificaciones no leídas:', err)
          });
        }
      },
      error: (err) => console.error('Error al obtener auth:', err)
    })
  }

  getMenu(){
    switch(this.router.url){
      case '/user/main/equipo':
        this.selectedMenu = 0;
        break;
      case '/user/main/my-teams':
        this.selectedMenu = 1;
        break;
      case '/user/main/partidos':
        this.selectedMenu = 2;
        break;      
      case '/user/main/estadisticas':
        this.selectedMenu = 3;
        break;
      case '/user/main/perfil':
        this.selectedMenu = 23;
        break;
      default:
        this.selectedMenu = 2;
        break;
    }
  }

  selectMenu(menu: number){
    switch(menu){
      case 0:
        this.router.navigate(['/user','main','equipo'])
        this.selectedMenu = menu
        break;
      case 1:   
        this.router.navigate(['/user','main','my-teams'])
        this.selectedMenu = menu
        break;
      case 2:
        this.router.navigate(['/user','main','partidos'])   
        this.selectedMenu = menu
        break;
      case 3:
        this.router.navigate(['/user','main','estadisticas'])
        this.selectedMenu = menu
        break;
      case 4:
        this.showSupportModal = true
        this.selectedMenu = menu
        break;
      case 5:   
        this.router.navigate(['/user','main','perfil'])
        this.selectedMenu = menu
        break;
      default:
        // this.router.navigate(['/user','main','partidos'])
        this.selectedMenu = 1
        break;
    }
  }


  async onLogout(){
    await this.authService.logout()

    this.router.navigate(['/login'])
  }

  clickNotification(){
    this.hasNotification = !this.hasNotification
  }

  clickMessage(){
    this.hasMessage = !this.hasMessage
  }

  changeShowModalNotification(){
    this.showModalNotification = !this.showModalNotification
  }

  getCentroIndex(): number {
    return Math.floor(this.menus.length / 2);
  }


  showSupportModal: boolean = false
  closeSupportModal(){
    this.showSupportModal = false
  }
  getDataSupportModal(data: string){
    const numero = '56933021601'
    const message = data

    const text = 
      `*Usuario:* ${this.perfil.nombre} ${this.perfil.apellido} \n` +
      `*ID:* ${this.perfil.id} \n\n` +
      `*Mensaje:* ${message}`

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blanck')

    this.closeSupportModal()
  }

  async updateNotificaciones(data: boolean | Notificacion){
    if(data == true){
      if(this.uid)
        await this.notificacionService.marcarTodasComoLeida(this.uid).subscribe()
      
      this.changeShowModalNotification()
    }else{
      this.showModalLoading = true
      this.changeShowModalNotification() 
      if(this.uid && data !== false && data.id && data.referenciaId){
        await this.notificacionService.marcarComoLeida(this.uid, data.id)    
        if(data.tipo === 'reserva'){
          const reservaSnap = await this.getReserva(this.uid, data.referenciaId)
          const horarioSnap = await this.getHorario(reservaSnap.horario_id)
          const canchaSnap = await this.getCancha(reservaSnap.horario_id, reservaSnap.cancha_id)

          this.redirectToMiPartido({
            reserva: reservaSnap,
            horario: horarioSnap,
            cancha: canchaSnap
          })
        }
      }
    }
  }

  async getReserva(uid: string, idReserva: string): Promise<Reserva2>{
      const x = await this.reservaService.getReservaByPerfil(uid, idReserva)  
      return x as Reserva2  
  }

  async getHorario(idHorario: string): Promise<Horario>{
    const x = await this.horarioService.getHorario(idHorario)
    return x as Horario
  }

  async getCancha(idHorario: string, idCancha: string): Promise<Cancha>{
    const x = await this.canchaService.getCanchaFromHorario(idHorario, idCancha)
    return x as Cancha
  }

  async redirectToMiPartido(data: {reserva: Reserva2, horario: Horario, cancha: Cancha}){
    await this.reservaTransferService.setDatos(data)
    this.showModalLoading = false

    this.router.navigate(['/user','mi-partido'])
  }
}

