import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { PartidosComponent } from "../partidos/partidos.component";
// import { TorneoComponent } from "../torneo/torneo.component";
// import { MensajesComponent } from "../mensajes/mensajes.component";
// import { PerfilComponent } from "../perfil/perfil.component";

@Component({
  selector: 'app-main',
  imports: [CommonModule], //, PartidosComponent, TorneoComponent, MensajesComponent, PerfilComponent],
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
