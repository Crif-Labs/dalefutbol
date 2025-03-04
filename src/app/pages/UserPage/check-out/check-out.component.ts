import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cancha } from '../../../interfaces/cancha';
import { Reserva } from '../../../interfaces/reserva';
import { Horario } from '../../../interfaces/horario';
import { Perfil } from '../../../interfaces/perfil';

@Component({
  selector: 'app-check-out',
  imports: [],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss'
})
export class CheckOutComponent {

  cancha: Cancha = {
    id: '123',
    nombre: 'SuperCancha',
    direccion: 'El Quillay 1168',
    comuna: 'La Pintana',
    capacidad: 16,
    capacidad_equipo: '7',
    precio: 4500
  }

  horario: Horario = {
    id: '321',
    hora_inicio: '22:00',
    hora_fin: '23:00',
    dia: '',
    // disponibilidad: true,
    // id_cancha: '123'
  }

  reserva: Reserva ={
    fecha: '12/02',
    estado: 'pendiente',
    reservadoPor: {
      tipo: 'jugador',
      id: '123123',
      jugadores: undefined
    },
    id_cancha: '123',
    id_horario: '321'
  }

  perfil: Perfil ={
    id: '123123',
    nombre: 'Cristobal',
    apellido: 'Riquelme',
    celular: '',
    rol: 'jugador',
    posicion: "Central",
    id_usuario: '456'
  }

  descuento = 0


  constructor(private router: Router){

  }

  buttonBack(){
    this.router.navigate(['reservas-check-in'])
  }

}
