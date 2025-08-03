import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingPageComponent } from "../../../shared/loading-page/loading-page.component";
import { ModalLoadingComponent } from "../../../shared/ModalDir/modal-loading/modal-loading.component";
import { EquipoService } from '../../../services/equipo.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Equipo } from '../../../interfaces/equipo';
import { firstValueFrom } from 'rxjs';
import { SolicitudesService } from '../../../services/solicitudes.service';
import { ModalSolicitudesComponent } from "../../../shared/ModalDir/modal-solicitudes/modal-solicitudes.component";
import { WorkingPageComponent } from "../../../shared/working-page/working-page.component";

@Component({
  selector: 'app-mis-equipos',
  imports: [CommonModule, ModalLoadingComponent, ModalSolicitudesComponent, WorkingPageComponent],
  templateUrl: './mis-equipos.component.html',
  styleUrl: './mis-equipos.component.scss'
})
export class MisEquiposComponent implements OnInit{

  loading: boolean = false
  existeEquipo: boolean = false

  listEquipo: {
    equipo: Equipo,
    countJugadores: number,
    stats: number
  }[] = []

  listSolicitudes: any[] = []

  constructor(private equipoService: EquipoService, private authService: AuthService, private router: Router, private solicitudesService: SolicitudesService){
  }


  async ngOnInit() {
    this.loading = true

    const uid = this.authService.getUid();

    if(uid){
      const equipoRef = await this.equipoService.perteneceAEquipo(uid);
      this.listSolicitudes = await this.solicitudesService.getSolicitudesEnProcesoJugador(uid)

      if(equipoRef.length === 0 ){
        console.log('El jugador no tiene equipos')
        this.existeEquipo = false
      }else{
        this.existeEquipo = true

        await Promise.all(
          equipoRef.map(e => this.getEquipos(e.id))
        )
      }
    }

    this.loading = false
  }


  async getEquipos(id: string){

    const equipo = await firstValueFrom(this.equipoService.getEquipo(id))

    const cantidad_jugadores = await this.equipoService.countJugadoresEquipo(id)
    const stats = await this.equipoService.getStatsEquipo(id)

    const puntos = stats ? (stats.victorias*3 + stats.empates) : 0

    this.listEquipo.push({
      equipo,
      countJugadores: cantidad_jugadores,
      stats: puntos
    })
  }

  showModalSolicitudes: boolean = false
  showListSolicitudes(){
    this.showModalSolicitudes = true
  }

  closeModal(){
    this.showModalSolicitudes = false
  }

  redirecToEquipos(){
    this.router.navigate(['/user','main','equipo'])
  }

  redirecToPerfilEquipo(id: string){
    console.log(id)
    this.router.navigate(['/user','mi-equipo','perfil',id])
  }

}
