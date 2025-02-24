import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
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
    }

    // constructor(private router:Router){

    // }
  
  
    selectMenu(menu: number){
      this.selectedMenu = menu
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
