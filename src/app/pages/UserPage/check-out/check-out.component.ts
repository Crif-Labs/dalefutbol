import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Cancha } from '../../../interfaces/cancha';
import { Reserva } from '../../../interfaces/reserva';
import { Horario } from '../../../interfaces/horario';
import { Perfil } from '../../../interfaces/perfil';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservaService } from '../../../services/reserva.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Reserva2 } from '../../../interfaces/reserva-2';

@Component({
  selector: 'app-check-out',
  imports: [CommonModule],
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
  
  perfil: Perfil ={
    id: '123123',
    nombre: 'Cristobal',
    apellido: 'Riquelme',
    celular: '',
    rol: 'jugador',
    posicion: "Central",
    id_usuario: '456'
  }

  // reserva: Reserva | Reserva2 ={
  //   fecha: '12/02',
  //   hora_inicio: this.horario.hora_inicio,
  //   reservadoPor: [{
  //     responsable: this.perfil,
  //     estado: 'pendiente'
  //   }],
  //   cancha: this.cancha,
  //   horario: this.horario
  // }

  reserva: Reserva2 = {
    fecha_reserva: '',
    hora_reserva: '',
    responsable: 'admin',
    estado: 'pendiente'
  }


  date = ''
  descuento = 0

  confirm: boolean = false


  constructor(private router: Router, private reservaService: ReservaService, private localStorageService: LocalStorageService, private sessionStorageService: SessionStorageService){
    if(localStorageService.getItem('perfil') != null || sessionStorageService.getItem('cancha') != null || sessionStorageService.getItem('horario')){

      this.cancha = JSON.parse(String(sessionStorageService.getItem('cancha')))

      this.cancha.precio = ((this.cancha.precio/(this.cancha.capacidad))+1500)*1.19

      this.perfil = JSON.parse(String(localStorageService.getItem('perfil')))

      this.horario = JSON.parse(String(sessionStorageService.getItem('horario')))

      this.horario.cancha_list = []

      const datePipe = new DatePipe('en-US')

      this.date = String(datePipe.transform(this.horario.dia, 'dd/MM'))

      // this.reserva = {
      //   fecha: this.horario.dia,
      //   hora_inicio: this.horario.hora_inicio,
      //   reservadoPor: [
      //     {
      //       responsable: this.perfil,
      //       estado: 'pendiente'
      //     }
      //   ],
      //   cancha: this.cancha,
      //   horario: this.horario
      // }

      const localDate = new Date()

      this.reserva = {
        fecha_reserva: localDate.toISOString().split('T')[0].replace(/-/g,'/'),//String(),
        hora_reserva: localDate.toTimeString().split(' ')[0].slice(0, 5),
        responsable: this.perfil,
        estado: 'pendiente'
      }




    }else{
      console.log("Problemas en la lectura de datos")
    }
  }

  async addReserva(){
    // console.log(this.confirm)
    // console.log(this.reserva)


    /**
     * Problema a resolver, necesito el id de la cancha que esta en horario,
     * no el id que tiene la cancha, de la coleccion cancha
     */

    await this.reservaService.addReserva(String(this.cancha.id), String(this.horario.id), this.reserva)

    this.router.navigate(['/user-main/partidos'])


    // this.reservaService.getReservaPorCHFH(this.reserva)
    //   .then(res => {

    //     /**
    //      * si no encuentra una reserva con las caracteristicas
    //      * crea una nueva.
    //      * 
    //      * Si la encuentra, la tiene que actualizar
    //      */
    //     if(res.length == 0){
    //       this.reservaService.addReserva(this.reserva)
    //       .then(res => console.log(res))
    //       .catch(error => console.log(error))
    //     }else{
    //       /** CODIGO DE ACTUALIZACION DE COLECCION */

    //       /**
    //        * ACTUALMENTE VAMOS ABUSCAR SI HAY ALGUNA RESERVA CON ESTAS CARACTERISTICAS
    //        * Y ACTUALIZAMOS LOS DATOS DE ESTOS CON LOS SIGUIETNES:
    //        *    HORARIO/ID(HORARIO)/CANCHA/ID(CANCHA)/INSCRITOS AGREGAMOS +1
    //        *    RESERVA/ID(RESERVA)/jugadores.estado
    //        */
    //     }
    //   })
    //   .catch(error => console.log(error))



  }

  buttonBack(){
    this.router.navigate(['reservas-check-in'])
  }

}
