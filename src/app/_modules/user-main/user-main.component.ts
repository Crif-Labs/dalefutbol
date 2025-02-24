import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-main',
  imports: [CommonModule, RouterOutlet],
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

  // constructor(private authService: AuthService, private router:Router){
  //   this.getAuth()
  // }

  constructor(private router:Router){

  }


  selectMenu(menu: number){
    this.selectedMenu = menu
  }

  // async getAuth(){

  //   await this.authService.getAuth().subscribe( user => {
  //     this.correo = user?.email
  //   })
  // }


  // async onLogout(){
  //   await this.authService.logout()

  //   this.router.navigate(['/login'])
  // }
}
