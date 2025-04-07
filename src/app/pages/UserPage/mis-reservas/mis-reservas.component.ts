import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-reservas',
  imports: [],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.scss'
})
export class MisReservasComponent {

  constructor(private router: Router){}

  buttonBack(){
    this.router.navigate(['user-main/partidos'])
  }

}
