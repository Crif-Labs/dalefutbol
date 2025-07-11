import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipo } from '../../../interfaces/equipo';
import { EquipoService } from '../../../services/equipo.service';
import { ModalLoadingComponent } from "../../../shared/ModalDir/modal-loading/modal-loading.component";
import { TimestampPipe } from '../../../pipes/timestamp.pipe';
import { EquipoEstadistica } from '../../../interfaces/equipo-estadistica';
import { Perfil } from '../../../interfaces/perfil';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-equipo-perfil',
  imports: [CommonModule, ModalLoadingComponent, TimestampPipe],
  templateUrl: './equipo-perfil.component.html',
  styleUrl: './equipo-perfil.component.scss'
})
export class EquipoPerfilComponent {

  loading: boolean = false

  equipo: Equipo = {
    id: '',
    nombre: '',
    color: '',
    creacion: Timestamp.fromDate(new Date())
  }
  equipoID: string | null
  statsEquipo: EquipoEstadistica = {
    partidos: 0,
    puntos: 0,
    victorias: 0,
    derrotas: 0,
    empates: 0
  }
  capitan: Perfil = {
    nombre: '',
    apellido: '',
    celular: '',
    rol: 'admin',
    id_usuario: ''
  }
  cocapitanes: Perfil[] = []
  jugadores: Perfil[] = []

  perteneceAlEquipo: boolean = false


  constructor(private router: Router, private route: ActivatedRoute, private equipoService: EquipoService, private authService: AuthService){
    this.loading = true

    this.equipoID = route.snapshot.paramMap.get('id')
    const uid = authService.getUid()

    if(this.equipoID && uid){
      const x = equipoService.getJugadorQuePertenece(this.equipoID, uid)
        .then(res => {
          res ? this.perteneceAlEquipo = true : this.perteneceAlEquipo = false
        })

      this.initDatas(this.equipoID)   
    }

    this.loading = false
  }

  initDatas(id: string){
      this.equipoService.getEquipo(id).subscribe( res => {
        this.equipo = res
      })
      this.equipoService.getStatsEquipo(id)
        .then( res => {
          if(res)
            this.statsEquipo = res
        })
      this.equipoService.getJugadoresPorCargo(id)
        .then(res => {
          if(res.capitan){
            this.capitan = res.capitan
            this.cocapitanes = res.cocapitanes
            this.jugadores = res.jugadores
          }
        })
  }

  buttonBack(){
    this.router.navigate(['/user','main','equipo'])
  }
}