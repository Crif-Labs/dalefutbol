import { Component, OnInit } from '@angular/core';
import { HorarioService } from '../../../services/horario.service';
import { CommonModule, formatDate } from '@angular/common';
import { Cancha } from '../../../interfaces/cancha';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../services/reserva.service';
import { Reserva2 } from '../../../interfaces/reserva-2';
import { LocalStorageService } from '../../../services/local-storage.service';
import { NotificacionService } from '../../../services/notificacion.service';



@Component({
  selector: 'app-reservas',
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.scss'
})
export class ReservasComponent implements OnInit {

  listCanchasToday: Cancha[] | any = []

  listHorarioCanchaToday: any = []
  today: Date = new Date()

  dateHorario: string | any = ''

  listReserva: Reserva2[] | any

  idPerfil: string | null = ''

  constructor(private notificacionService: NotificacionService,private horarioService: HorarioService, private reservaService: ReservaService, private lsService: LocalStorageService){

  }

  ngOnInit(): void {
    // this.idPerfil = this.lsService.getItem('idPerfil')

    this.dateHorario = formatDate(this.today, 'yyyy-MM-dd', 'en-US')

    this.horarioService.getHorarioPorDia(this.dateHorario)
      .subscribe(listHorario => {
        if (!listHorario || listHorario.length === 0) {
          console.log("❌ No Hay Horarios para hoy");
          this.listHorarioCanchaToday = [];
          return;
        }

        this.listHorarioCanchaToday = listHorario.map(horario => ({
          horario: horario,
          canchaList: []
        }))

        listHorario.forEach((horario, index) => {
          if (horario.id) {
            this.horarioService.getCanchaHorario(horario.id)
              .subscribe(canchaList => {
                // 🔄 Actualizamos la lista de canchas en el índice correspondiente
                this.listHorarioCanchaToday[index].canchaList = canchaList || [];
              });
          } else {
            console.log(`❌ No Hay canchas para el horario fecha: ${horario.dia}, hora: ${horario.hora_inicio}`);
          }
        })
    });
  }

  horario: string = ''
  cancha: string = ''

  onClickDetalles(horarioID: string, canchaID: string){
    this.horario = horarioID
    this.cancha = canchaID

  }

  onClickPrueba(){
    console.log(this.listHorarioCanchaToday)
  }

  
  getHorarioForDate(){
    console.log(this.dateHorario)

    this.horarioService.getHorarioPorDia(this.dateHorario)
    .subscribe(listHorario => {
      if (!listHorario || listHorario.length === 0) {
        console.log("❌ No Hay Horarios para hoy");
        this.listHorarioCanchaToday = [];
        return;
      }

      this.listHorarioCanchaToday = listHorario.map(horario => ({
        horario: horario,
        canchaList: []
      }))

      listHorario.forEach((horario, index) => {
        if (horario.id) {
          this.horarioService.getCanchaHorario(horario.id)
            .subscribe(canchaList => {
              // 🔄 Actualizamos la lista de canchas en el índice correspondiente
              this.listHorarioCanchaToday[index].canchaList = canchaList || [];
            });
        } else {
          console.log(`❌ No Hay canchas para el horario fecha: ${horario.dia}, hora: ${horario.hora_inicio}`);
        }
      })
    });
  }

  getListReserva(horarioID: string, canchaID: string){
    this.horario = horarioID
    this.cancha = canchaID

    this.reservaService.getListReserva(horarioID, canchaID).subscribe(
      res => this.listReserva = res
    )

  }

  reserva: string = ''

  setReservaID(reservaID: string, perfilID: string){
    this.reserva = reservaID
    this.idPerfil = perfilID
  }

  updateEstadoReserva(status: string){
    let message: string = ''

    switch(status){
      case 'Confirmado':
        message = 'Reserva confirmada! ✅';
        break;
      case 'Pendiente':
        message = 'Tu reserva aún está a la espera. Busca más información en Atención al cliente'
        break;
      case 'Cancelado':
        message = 'Reserva cancelada. ❌'
        break;
      default:
        message = 'Error 2001'
        break;
    }

    if(!this.idPerfil){
      console.log("Error al obtener el UID")
    }else{
      this.reservaService.updateEstado(this.horario, this.cancha, this.reserva, this.idPerfil, status)
        .then(() => {
          this.notificacionService.addNotificacion(String(this.idPerfil), {
            mensaje: message,
            leido: false,
            fecha: new Date(),
            tipo: 'reserva',
            referenciaId: this.reserva
          }).then(() => {console.log('Notificacion agregada')})
        })


    }

    

    // if(this.idPerfil){
    
    // }else{
    //   console.log("No se realizo la acutalizacion, intente nuevamente")
    // }
  }

}
