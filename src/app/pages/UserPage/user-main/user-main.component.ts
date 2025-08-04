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

@Component({
  selector: 'app-user-main',
  imports: [CommonModule, RouterOutlet, ModalNotificationComponent, ModalSupportComponent],
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
    private lsService: LocalStorageService){
  }
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
            next: (res) => this.hasNotification = res,
            error: (err) => console.error('Error al obtener notificaciones no leídas:', err)
          });

          this.notificacionService.getNotificacionesByUser(this.uid).subscribe({
            next: (res) => this.listNotificacion = res,
            error: (err) => console.error('Error al obtener lista de notificaciones:', err)
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
}

