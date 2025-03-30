import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanchasComponent } from "../canchas/canchas.component";
import { HorariosComponent } from "../horarios/horarios.component";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-admin-main',
  imports: [CommonModule, CanchasComponent, HorariosComponent, RouterOutlet],
  templateUrl: './admin-main.component.html',
  styleUrl: './admin-main.component.scss'
})
export class AdminMainComponent {

}
