import { Component, OnInit } from '@angular/core';
import { HorarioService } from '../../../services/horario.service';
import { CommonModule, formatDate } from '@angular/common';
import { Cancha } from '../../../interfaces/cancha';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../services/reserva.service';
import { Reserva2 } from '../../../interfaces/reserva-2';
import { LocalStorageService } from '../../../services/local-storage.service';



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

  constructor(private horarioService: HorarioService, private reservaService: ReservaService, private lsService: LocalStorageService){

  }

  ngOnInit(): void {
    this.idPerfil = this.lsService.getItem('idPerfil')

    this.dateHorario = formatDate(this.today, 'yyyy-MM-dd', 'en-US')

    this.horarioService.getHorario(this.dateHorario)
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

    this.horarioService.getHorario(this.dateHorario)
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

  setReservaID(reservaID: string){
    this.reserva = reservaID
  }

  updateEstadoReserva(status: string){

    if(this.idPerfil){
      this.reservaService.updateEstado(this.horario, this.cancha, this.reserva, this.idPerfil, status)
    }else{
      console.log("No se realizo la acutalizacion, intente nuevamente")
    }
  }

}
