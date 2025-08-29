import { CommonModule, DatePipe, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Storage, ref, listAll, getDownloadURL  } from '@angular/fire/storage';
import { Cancha } from '../../../interfaces/cancha';
import {GoogleMap, GoogleMapsModule} from '@angular/google-maps';
import { GoogleMapsService } from '../../../services/google-maps.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingPageComponent } from "../../../shared/loading-page/loading-page.component";
import { Horario } from '../../../interfaces/horario';
import { SessionStorageService } from '../../../services/session-storage.service';
import { ReservaService } from '../../../services/reserva.service';
import { ModalResponseComponent } from "../../../shared/ModalDir/modal-response/modal-response.component";
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-reserva',
  imports: [CommonModule, FormsModule, GoogleMap, GoogleMapsModule, LoadingPageComponent, ModalResponseComponent],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.scss'
})
export class ReservaComponent implements OnInit, AfterViewInit {

  center = { lat: 0, lng: 0 }; // Ejemplo: Santiago, Chile
  zoom = 13;
  markerPosition = this.center
  adress = ''
  
  loading: Boolean = true

  images: string[] = [];
  profile_photo: string[] = [];

  TeamsColor: {nombre: string, color: string}[] = [
    {
      nombre: 'Blanco',
      color: 'blanco'
    },
    {
      nombre: 'Azul',
      color: 'azul'
    }
  ]

  colorTeam = ''

  teams = [
    {
      name: 'Equipo 1',
      color: 'white',
      players: [
        {
          nombre: '',
          apellido: ''
        }
      ]
    },
    {
      name: 'Equipo 2',
      color: 'blue',
      players: [
        {
          nombre: '',
          apellido: ''
        }
      ]
    }

  ]

  dataCancha: Cancha = {
    nombre: 'SuperCancha',
    direccion: 'San Ricardo, La Pintana',
    capacidad: 7,
    precio: 4700,
    capacidad_equipo: '',
    comuna: ''
  }

  dataReserva: any

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

  isBroser: boolean = false

  constructor(
    private reservaService: ReservaService, 
    private storage: Storage, private router: Router, 
    private googleMapsServices: GoogleMapsService, 
    private ssService: SessionStorageService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: object
  ){

    this.isBroser = isPlatformBrowser(platformId)


  }

  ngOnInit(): void {

    const cancha = this.ssService?.getItem('cancha')    

    if(!cancha){
      location.reload()    
    }else{
      this.cargarDatos()
    }    
  }


  ngAfterViewInit(): void {

    this.loading = false
      
  }

  showButtonReservaPendiente: boolean = false

  async cargarDatos(){
    const ssCancha =  this.ssService.getItem('cancha')    
    const ssHorario =  this.ssService.getItem('horario')    

    if(ssCancha != null || ssHorario != null){
      this.dataCancha = JSON.parse(String(ssCancha))

      const horario: Horario = JSON.parse(String(ssHorario))

      const uid = this.authService.getUid()
      let x

      if(uid && horario.id){
        x = await this.reservaService.getReservaByHorario(uid, horario.id)

        console.log(x)

        switch(x){
          case true:
            this.showButtonReservaPendiente = true
            this.showModalResponseReservaPendienteHorario = true
            break;
          case null:
            console.log('❌ Error al buscar el horario en la reserva')
            break;
          default:
            this.showButtonReservaPendiente = false
            this.showModalResponseReservaPendienteHorario = false
            break;
        }

      }

    // se asigna los links de las imagenes obtenidas de la cancha
      this.dataCancha.link_image != undefined ? this.images = this.dataCancha.link_image : this.images = []

      this.adress = this.dataCancha.direccion+", "+this.dataCancha.comuna

      const datePipe = new DatePipe('en-US')
      this.dataReserva = [
        {
          icon: 'fa-solid fa-stopwatch',
          detail: horario.hora_inicio
        },
        {
          icon: 'fa-solid fa-calendar-days',
          detail: datePipe.transform(horario.dia, 'dd/MM')
        },
        {
          icon: 'fa-regular fa-hourglass-half',
          detail: '60 min'
        },
        {
          icon: 'fa-solid fa-dollar-sign',
          detail: Math.ceil(((this.dataCancha.precio/(this.dataCancha.capacidad))+1500)*1.19 /100) *100
        }
      ]
    

    this.reservaService.getPerfilesPorColorReserva(String(horario.id), String(this.dataCancha.id),'blanco','azul')
      .subscribe(res => {
        // console.log(res)
        this.teams = [
          {
            name: 'Equipo 1',
            color: 'blanco',
            players: res.color1
          }, 
          {
            name: 'Equipo 2',
            color: 'azul',
            players: res.color2
          }
        ]
      })
    
    this.initPage()

    
    this.profile_photo = []

    }else{
    }
  }

  async initPage(){
    // await this.getProfilePhoto()
    await this.buscarDireccion()
  }



  pickColorTeam(color: string){

    if(this.colorTeam == color){
      this.colorTeam = ''
    }else{
      this.colorTeam = color
    }    
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  buttonBack(){
    this.router.navigate(['/user','main','partidos'])
  }

  async buscarDireccion(){
    const coordenadas = await this.googleMapsServices.getCoordenadas(this.adress);

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

  atencionClienteWSP(estado: 'Pendiente' | 'Cancelado' | 'Confirmado' | undefined){
    const numero = '56933021601'
    let message

    const uid = this.authService.getUid()

    switch(estado){
      case 'Pendiente':
        message = 'Quiero hacer una consulta de mi reserva!';
        break;
      case 'Cancelado':
        message = 'Mi Reserva fue rechazada, me gustaria saber la informacion'
        break;
      case undefined:
        message = 'Error al ver partido en reserva'
        break;
    }
    
    const text = 
      `*Usuario:* ${uid} \n` +
      `*Mensaje:* ${message}`


    const url = `https://wa.me/${numero}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blanck')
  }

  async getPhoto(){
    if(this.dataCancha.link_image != undefined){
      this.images = await this.dataCancha.link_image
    }else{
    }
    
  }

  // getProfilePhoto(){
  //   const photoProfileRef = ref(this.storage, '/profile-photos')

  //   listAll(photoProfileRef)
  //     .then( async (response) => {
  //       this.profile_photo = []

  //       for(let item of response.items){
  //         const url = await getDownloadURL(item)
  //         this.profile_photo.push(url)
  //       }


  //       let i = 0
  //       for(let team of this.teams){

  //         for(let player of team.players){
  //           player.url_photo_profile = this.profile_photo[i]
  //         }

  //         i++
  //       }
  //     }).catch( (error) => {
  //     })
  // }

  showModalResponse: boolean = false
  showModalResponseReservaPendienteHorario: boolean = false
  closeModalResponse(){
    this.showModalResponse = false
    this.showModalResponseReservaPendienteHorario = false
  }


  redirecToCheckOut(){
    if(this.colorTeam == ''){
      this.showModalResponse = true
    }else{
      this.router.navigate(['/user','check-out'], {queryParams : {color: this.colorTeam}})
    }
    
  }

}
