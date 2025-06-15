import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Perfil } from '../../../interfaces/perfil';
import { PerfilService } from '../../../services/perfil.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { ModalNotificationComponent } from "../../../shared/ModalDir/modal-notification/modal-notification.component";
import { Notificacion } from '../../../interfaces/notificacion';

@Component({
  selector: 'app-user-main',
  imports: [CommonModule, RouterOutlet, ModalNotificationComponent],
  templateUrl: './user-main.component.html',
  styleUrl: './user-main.component.scss'
})
export class UserMainComponent {


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
      name: 'Equipo',
      icon: 'fa-solid fa-people-group'
    },
    {
      name: 'Partidos',
      icon: 'fa-regular fa-futbol'
    },
    {
      name: 'Perfil',
      icon: 'fa-regular fa-user'
    },
  ]

  selectedMenu: number = 0

  uid: string | null = ''

  constructor(private notificacionService: NotificacionService,private authService: AuthService, private router:Router, private perfilService: PerfilService, private lsService: LocalStorageService){

    this.getMenu()

    this.initPage()

    this.uid = authService.getUid()

    if(this.uid){
      notificacionService.getNotificacionesNoLeidas(this.uid)
        .subscribe(res => {
          this.hasNotification = res
      })

      notificacionService.getNotificacionesByUser(this.uid)
        .subscribe(res => {
          this.listNotificacion = res
      })
    }
      



  }

  async initPage(){
    try{
      await this.authService.getAuth().subscribe(
        res => {
          this.perfilService.getPerfilByUID(String(res?.uid))
            .then(res => {
              this.lsService.setItem('idPerfil',String(res?.id))
              this.lsService.setItem('perfil',JSON.stringify(res))
            })
        }
      )

    }catch(error){
      console.log(error)
    }


  }

  getMenu(){
    switch(this.router.url){
      case '/user/main/equipo':
        this.selectedMenu = 0;
        break;
      case '/user/main/partidos':
        this.selectedMenu = 1;
        break;
      case '/user/main/perfil':
        this.selectedMenu = 2;
        break;
      default:
        this.selectedMenu = 1;
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
        this.router.navigate(['/user','main','partidos'])
        this.selectedMenu = menu
        break;
      case 2:
        this.router.navigate(['/user','main','perfil'])
        this.selectedMenu = menu
        break;
      default:
        this.router.navigate(['/user','main','partidos'])
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



}

