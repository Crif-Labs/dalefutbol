import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Perfil } from '../../../interfaces/perfil';
import { PerfilService } from '../../../services/perfil.service';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-user-main',
  imports: [CommonModule,  RouterOutlet],
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



  correo: string | any = ''

  menus = [
    {
      name: 'Partidos',
      icon: 'fa-regular fa-futbol'
    },
    {
      name: 'Torneo',
      icon: 'fa-solid fa-trophy'
    },
    {
      name: 'Mensajes',
      icon: 'fa-regular fa-comments'
    },
    {
      name: 'Perfil',
      icon: 'fa-regular fa-user'
    },
  ]

  selectedMenu: number = 0

  constructor(private authService: AuthService, private router:Router, private perfilService: PerfilService, private lsService: LocalStorageService){


    this.initPage()


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
      case '/user-main/partidos':
        this.selectedMenu = 0;
        break;
      case '/user-main/torneo':
        this.selectedMenu = 1;
        break;
      case '/user-main/chat':
        this.selectedMenu = 2;
        break;
      case '/user-main/perfil':
        this.selectedMenu = 3;
        break;
      default:
        this.selectedMenu = 0;
        break;
    }
  }

  selectMenu(menu: number){
    switch(menu){
      case 0:
        this.router.navigate(['user-main/partidos']);
        this.selectedMenu = menu
        break;
      case 1:
        this.router.navigate(['user-main/torneo']);
        this.selectedMenu = menu
        break;
      case 2:
        this.router.navigate(['user-main/chat']);
        this.selectedMenu = menu
        break;
      case 3:
        this.router.navigate(['user-main/perfil']);
        this.selectedMenu = menu
        break;
      default:
        this.router.navigate(['user-main/partidos']);
        this.selectedMenu = 0
        break;
    }
    // this.selectedMenu = menu
  }


  async onLogout(){
    await this.authService.logout()

    this.router.navigate(['/login'])
  }




}

