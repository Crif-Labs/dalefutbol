import { Component } from '@angular/core';
import { WorkingPageComponent } from "../../../shared/working-page/working-page.component";
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [WorkingPageComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {

  constructor(private authService: AuthService, private router: Router){

  }

  async onLogout(){
    await this.authService.logout()

    this.router.navigate(['/login'])
  }

}
