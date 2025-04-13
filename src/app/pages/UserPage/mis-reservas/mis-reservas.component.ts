import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HorarioService } from '../../../services/horario.service';
import { ReservaService } from '../../../services/reserva.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Reserva2 } from '../../../interfaces/reserva-2';
import { CanchaService } from '../../../services/cancha.service';
import { LoadingPageComponent } from "../../../shared/loading-page/loading-page.component";
import { CommonModule } from '@angular/common';
import { Horario } from '../../../interfaces/horario';
import { Cancha } from '../../../interfaces/cancha';
import { TimestampPipe } from '../../../pipes/timestamp.pipe';
import { ReservaTransferServiceService } from '../../../services/reserva-transfer-service.service';

@Component({
  selector: 'app-mis-reservas',
  imports: [LoadingPageComponent, CommonModule, TimestampPipe],
  templateUrl: './mis-reservas.component.html',
  styleUrl: './mis-reservas.component.scss'
})
export class MisReservasComponent implements OnInit{

  loading: boolean = false

  listReservaFromPerfil: Reserva2[] = []

  listPro: {
    reserva: Reserva2,
    horario: Horario,
    cancha: Cancha
  }[] = []

  canchaName: string = 'cancha'

  constructor(
    private router: Router, 
    private lsService: LocalStorageService, 
    private horarioServices: HorarioService,
    private reservaService: ReservaService,
    private canchaService: CanchaService,
    private reservaTransferService: ReservaTransferServiceService
  ){}


  async ngOnInit() {
    this.loading = await true

    const idPerfil = await this.lsService.getItem('idPerfil')

    if(idPerfil){
      this.listReservaFromPerfil = await this.reservaService.getReservaFromPerfil(idPerfil)

      if(this.listReservaFromPerfil){
        let cancha: Cancha | null
        let horario: Horario | null
  
        for(let reserva of this.listReservaFromPerfil){
          cancha = await this.getCancha(reserva.horario_id, reserva.cancha_id)
          horario = await this.getHorario(reserva.horario_id)
  
          if(cancha && horario){
            this.listPro.push({
              reserva: reserva,
              horario: horario,
              cancha: cancha
            })
          }else{
            throw new Error('No se han encontrado datos');    
          }

        }
      }else{
        throw new Error('Lista Vacia');
      }     
    }else{
      throw new Error('Error en la lectura de idPerfil');
    }

    this.loading = await false
  }

  async getCancha(horarioID: string, canchaID: string): Promise<Cancha | null>{ 

    return await this.canchaService.getCanchaFromHorario(horarioID, canchaID)
      .then(res => {
        return res;
      })
      .catch(error => {
        return null;
      });  
  }

  async getHorario(horarioID: string): Promise<Horario | null>{
    return await this.horarioServices.getHorario(horarioID)
      .then(res => {
        return res
      }).catch(error => {
        return null
      })
  }

  async redirecToMisPartidos(data: {reserva: Reserva2, horario: Horario, cancha: Cancha}){
    await this.reservaTransferService.setDatos({
      reserva: data.reserva,
      horario: data.horario,
      cancha: data.cancha
    })

    this.router.navigate(['mi-partido'])
  }

  buttonBack(){
    this.router.navigate(['user-main/partidos'])
  }

}
