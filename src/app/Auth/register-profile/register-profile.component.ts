import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterAppComponent } from "../../shared/footer-app/footer-app.component";

@Component({
  selector: 'app-register-profile',
  imports: [CommonModule, FooterAppComponent],
  templateUrl: './register-profile.component.html',
  styleUrl: './register-profile.component.scss'
})
export class RegisterProfileComponent {

  show: boolean = true

  comunas = [
    { "nombre": "Cerrillos", "latitud": -33.4931, "longitud": -70.7146 },
    { "nombre": "Cerro Navia", "latitud": -33.4169, "longitud": -70.7349 },
    { "nombre": "Conchalí", "latitud": -33.3865, "longitud": -70.6797 },
    { "nombre": "El Bosque", "latitud": -33.5610, "longitud": -70.6623 },
    { "nombre": "Estación Central", "latitud": -33.4569, "longitud": -70.6990 },
    { "nombre": "Huechuraba", "latitud": -33.3609, "longitud": -70.6643 },
    { "nombre": "Independencia", "latitud": -33.4144, "longitud": -70.6646 },
    { "nombre": "La Cisterna", "latitud": -33.5328, "longitud": -70.6591 },
    { "nombre": "La Florida", "latitud": -33.5230, "longitud": -70.5697 },
    { "nombre": "La Granja", "latitud": -33.5379, "longitud": -70.6231 },
    { "nombre": "La Pintana", "latitud": -33.5833, "longitud": -70.6291 },
    { "nombre": "La Reina", "latitud": -33.4498, "longitud": -70.5402 },
    { "nombre": "Las Condes", "latitud": -33.4072, "longitud": -70.5675 },
    { "nombre": "Lo Barnechea", "latitud": -33.3625, "longitud": -70.5183 },
    { "nombre": "Lo Espejo", "latitud": -33.5181, "longitud": -70.6956 },
    { "nombre": "Lo Prado", "latitud": -33.4445, "longitud": -70.7264 },
    { "nombre": "Macul", "latitud": -33.4878, "longitud": -70.5989 },
    { "nombre": "Maipú", "latitud": -33.4867, "longitud": -70.7617 },
    { "nombre": "Ñuñoa", "latitud": -33.4550, "longitud": -70.6010 },
    { "nombre": "Pedro Aguirre Cerda", "latitud": -33.4873, "longitud": -70.6733 },
    { "nombre": "Peñalolén", "latitud": -33.4982, "longitud": -70.5454 },
    { "nombre": "Providencia", "latitud": -33.4254, "longitud": -70.6152 },
    { "nombre": "Pudahuel", "latitud": -33.4489, "longitud": -70.7703 },
    { "nombre": "Quilicura", "latitud": -33.3634, "longitud": -70.7330 },
    { "nombre": "Quinta Normal", "latitud": -33.4372, "longitud": -70.7031 },
    { "nombre": "Recoleta", "latitud": -33.4033, "longitud": -70.6331 },
    { "nombre": "Renca", "latitud": -33.3930, "longitud": -70.7196 },
    { "nombre": "San Joaquín", "latitud": -33.4890, "longitud": -70.6338 },
    { "nombre": "San Miguel", "latitud": -33.4976, "longitud": -70.6511 },
    { "nombre": "San Ramón", "latitud": -33.5361, "longitud": -70.6401 },
    { "nombre": "Santiago", "latitud": -33.4489, "longitud": -70.6693 },
    { "nombre": "Vitacura", "latitud": -33.3991, "longitud": -70.5834 }
  ]
  
  comunaSeleccionada: any;

  constructor(private router: Router){}

  backRegister(){
    this.router.navigate(['/register'])


  }
}
