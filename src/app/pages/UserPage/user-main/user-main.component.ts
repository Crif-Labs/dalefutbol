import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-main',
  imports: [],
  templateUrl: './user-main.component.html',
  styleUrl: './user-main.component.scss'
})
export class UserMainComponent {

  correo: string | any = ''

  constructor(private authService: AuthService, private router:Router){
    this.getAuth()
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

