import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanchasComponent } from "../canchas/canchas.component";
import { HorariosComponent } from "../horarios/horarios.component";


@Component({
  selector: 'app-admin-main',
  imports: [CommonModule, CanchasComponent, HorariosComponent],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.scss'
})
export class AdminMainComponent {

}
