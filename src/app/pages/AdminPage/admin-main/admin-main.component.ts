import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-main',
  imports: [],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.scss'
})
export class AdminMainComponent {

  constructor(private authService: AuthService){}

  onLogout(){
    this.authService.logout()
  }
}
