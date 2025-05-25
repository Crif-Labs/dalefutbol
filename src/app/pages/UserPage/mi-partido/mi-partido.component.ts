import { Component, OnInit } from '@angular/core';
import { ReservaTransferServiceService } from '../../../services/reserva-transfer-service.service';
import { Reserva2 } from '../../../interfaces/reserva-2';
import { Horario } from '../../../interfaces/horario';
import { Cancha } from '../../../interfaces/cancha';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingPageComponent } from "../../../shared/loading-page/loading-page.component";
import { ReservaService } from '../../../services/reserva.service';
import { GoogleMapsService } from '../../../services/google-maps.service';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-mi-partido',
  imports: [CommonModule, LoadingPageComponent, GoogleMap, GoogleMapsModule],
  templateUrl: './mi-partido.component.html',
  styleUrl: './mi-partido.component.scss'
})
export class MiPartidoComponent implements OnInit{

  loading: boolean = false

  data!: {
    reserva: Reserva2 | null,
    horario: Horario | null,
    cancha: Cancha | null
  } | null

  precioCancha: Number = 0

  formatMatch = [
    {
      category: 'medio',
      text: "Juego de 2 equipos de 7, 60 minutos en total."
    },
    {
      category: 'medio',
      text: "Juego para todo nivel y todo genero."
    },
    {
      category: 'important',
      text: "Solo jugadores inscritos pueden jugar este partido."
    },
    {
      category: 'medio',
      text: "El minimo de jugadores es de 10 en total (5 por equipo), si no el partido sera cancelado."
    },
    {
      category: 'medio',
      text: "Por favor llegar con 10 minutos de anticipacion para la preparacion del partido; esto podria afectar a la duracion de tu juego."
    } 
  ]

  colorTeams: {color1: any[], color2: any[]} = {color1: [], color2: []}

  center = { lat: 0, lng: 0 }; // Ejemplo: Santiago, Chile
  zoom = 13;
  markerPosition = this.center
  adress = ''

  constructor(
    private router: Router,
    private reservaTransferSrevice: ReservaTransferServiceService,
    private reservaService: ReservaService,
    private googleMapServices: GoogleMapsService
  ){}

  async ngOnInit() {

    this.data = await this.reservaTransferSrevice.getDatos()


    if(!this.data.reserva || !this.data.horario || !this.data.cancha)
      this.router.navigate(['/user','mis-reservas'])

    this.adress = await `${this.data.cancha?.direccion}, ${this.data.cancha?.comuna}`
    this.precioCancha = await Math.ceil(((Number(this.data.cancha?.precio)/Number(this.data.cancha?.capacidad))+1500)*1.19 / 100) * 100

    await this.reservaService.getPerfilesPorColorReserva(String(this.data.horario?.id), String(this.data.cancha?.id), 'blanco', 'azul')
      .subscribe(res => {
        this.colorTeams = res
      })
    await this.buscarDireccion()

    this.loading = false

  }


  async buscarDireccion(){
    const coordenadas = await this.googleMapServices.getCoordenadas(this.adress);

    if(coordenadas){
      this.markerPosition = await coordenadas,
      this.center = await coordenadas
    }

    return coordenadas;

  }

  async abrirGoogleMaps(){
    const coordenadas: {lat: number; lng: number;} | any = await this.buscarDireccion();

    if(coordenadas){
      const url = `https://www.google.com/maps?q=${coordenadas.lat},${coordenadas.lng}`
      window.open(url, '_blank')
    }


  }

  buttonBack(){
    this.router.navigate(['/user','mis-reservas'])
  }

  atencionClienteWSP(estado: 'Pendiente' | 'Cancelado' | 'Confirmado' | undefined){
    const numero = '56933021601'
    let message

    switch(estado){
      case 'Pendiente':
        message = 'Mi Reserva aun sale como pendiente, por favor mayor informacion';
        break;
      case 'Cancelado':
        message = 'Mi Reserva fue rechazada, me gustaria saber la informacion'
        break;
      case undefined:
        message = 'Error al ver partido en reserva'
        break;
    }
    
    const text = 
      `*Reserva:* ${this.data?.reserva?.id} \n` +
      `*ID:* ${this.data?.reserva?.responsable.id} \n\n` +
      `*Mensaje:* ${message}`

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blanck')
  }

}
