import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-main',
  imports: [CommonModule,  RouterOutlet],
  templateUrl: './user-main.component.html',
  styleUrl: './user-main.component.scss'
})
export class UserMainComponent {

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

  constructor(private authService: AuthService, private router:Router){
    this.getAuth()
    this.getMenu()
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

    await this.authService.getAuth().subscribe( user => {
      this.correo = user?.email
    })
  }


  async onLogout(){
    await this.authService.logout()

    this.router.navigate(['/login'])
  }




}

