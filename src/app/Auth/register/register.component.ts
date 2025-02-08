import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterAppComponent } from "../../shared/footer-app/footer-app.component";

@Component({
  selector: 'app-register',
  imports: [CommonModule, FooterAppComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  show: boolean = false

  constructor(private router: Router){}

  onRegister(){
    console.log("Primero debe quedar regisrrado en firebase")

    this.router.navigate(['/register-profile'])
  }

  backLogin(){
    this.router.navigate(['/login'])
  }

}
