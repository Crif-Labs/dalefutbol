import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cancha } from '../../../interfaces/cancha';
import { Reserva } from '../../../interfaces/reserva';
import { Horario } from '../../../interfaces/horario';
import { Perfil } from '../../../interfaces/perfil';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservaService } from '../../../services/reserva.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Reserva2 } from '../../../interfaces/reserva-2';
import { PerfilService } from '../../../services/perfil.service';

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

  reserva: Reserva2 = {
    fecha_reserva: '',
    hora_reserva: '',
    responsable: this.perfil,//'admin',
    estado: 'Pendiente',
    color: ''
  }


  date = ''
  descuento = 0

  confirm: boolean = false

  colorTeam: string = ''


  constructor(private router: Router, private dataRoute: ActivatedRoute, private perfilService: PerfilService, private reservaService: ReservaService, private localStorageService: LocalStorageService, private sessionStorageService: SessionStorageService){
    if(localStorageService.getItem('perfil') != null || sessionStorageService.getItem('cancha') != null || sessionStorageService.getItem('horario')){

      dataRoute.queryParams.subscribe( params => {
        this.colorTeam = params['color']
      })

      this.cancha = JSON.parse(String(sessionStorageService.getItem('cancha')))

      this.cancha.precio = ((this.cancha.precio/(this.cancha.capacidad))+1500)*1.19

      this.perfil = JSON.parse(String(localStorageService.getItem('perfil')))

      this.horario = JSON.parse(String(sessionStorageService.getItem('horario')))

      this.horario.cancha_list = []

      const datePipe = new DatePipe('es-CL')

      this.date = String(datePipe.transform(this.horario.dia, 'dd/MM'))

      const localDate = new Date()

      this.reserva = {
        fecha_reserva: String(datePipe.transform(localDate, 'yyyy/MM/dd')),//localDate.toISOString().split('T')[0].replace(/-/g,'/'),//String(),
        hora_reserva: localDate.toTimeString().split(' ')[0].slice(0, 5),
        responsable: this.perfil,
        color: this.colorTeam,
        estado: 'Pendiente'
      }

    }else{
      console.log("Problemas en la lectura de datos")
    }
  }

  async addReserva(){
    try {
      const newReserva = await this.reservaService.addReserva(String(this.cancha.id), String(this.horario.id), String(this.perfil.id), this.reserva)
      
      if(!newReserva){
        console.log("❌ No se pudo realizar la reserva.");
        return;
      }

      console.log("✅ Reserva completada con éxito:", newReserva);
      this.router.navigate(['/user-main/partidos']);

    } catch (error) {
      console.log("❌ Error en el proceso de reserva:", error);
    }
  }


  buttonBack(){
    this.router.navigate(['reservas-check-in'])
  }

}
