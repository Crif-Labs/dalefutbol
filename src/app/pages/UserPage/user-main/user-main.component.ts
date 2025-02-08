import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-main',
  imports: [],
  templateUrl: './user-main.component.html',
  styleUrl: './user-main.component.scss'
})
export class UserMainComponent {

  constructor(private authService: AuthService){}


  onLogout(){
    this.authService.logout()
  }
}

