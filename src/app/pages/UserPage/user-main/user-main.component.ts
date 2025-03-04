import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Perfil } from '../../../interfaces/perfil';
import { PerfilService } from '../../../services/perfil.service';

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
  id_usuario: string | any //= "hcJa0nlFOBaC9Zbi9zNoxbmFo1i2"
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

  constructor(private authService: AuthService, private router:Router, private perfilService: PerfilService){
    this.id_usuario = this.getAuth()
    this.getMenu()
    this.setIdUsuarioLocalStorage()
  }

  async setIdUsuarioLocalStorage(){
    await localStorage.setItem('idPerfil',this.idPerfil);

    await this.perfilService.getPerfilById(this.idPerfil).subscribe(
      response => {
        localStorage.setItem('perfil', JSON.stringify(response))
      }
    )
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

  async getAuth(){

    return "hcJa0nlFOBaC9Zbi9zNoxbmFo1i2"

    // await this.authService.getAuth().subscribe( user => {
    //   this.correo = user?.email
    // })
  }


  async onLogout(){
    await this.authService.logout()

    this.router.navigate(['/login'])
  }




}

