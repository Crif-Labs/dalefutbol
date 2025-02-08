import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterAppComponent } from "../../shared/footer-app/footer-app.component";

@Component({
  selector: 'app-login',
  imports: [CommonModule, FooterAppComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  show: boolean = false;

  constructor(private router: Router){

  }

  onLogin(){

  }


  onRegister(){    
    this.router.navigate(['/register'])
  }
}
