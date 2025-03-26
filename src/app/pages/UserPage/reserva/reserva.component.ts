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


@Component({
  selector: 'app-reserva',
  imports: [CommonModule, FormsModule, GoogleMap, GoogleMapsModule, LoadingPageComponent],
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

  teams = [
    {
      name: 'Equipo 1',
      color: 'white',
      players: [
        {
          name: 'Carlo Magno',
          url_photo_profile: ''
        },
        {
          name: 'Atila el Huno',
          url_photo_profile: ''
        },
        {
          name: 'Ragnar Lothbrok',
          url_photo_profile: ''
        },
        {
          name: 'William Wallace',
          url_photo_profile: ''
        }
      ]
    },
    {
      name: 'Equipo 2',
      color: 'blue',
      players: [
        {
          name: 'Carlo V',
          url_photo_profile: 'gs://dale-futbol.firebasestorage.app/profile-photos/Profile-2.webp'
        },
        {
          name: 'Napoleon Bonaparte',
          url_photo_profile: 'gs://dale-futbol.firebasestorage.app/profile-photos/Profile-2.webp'
        },
        {
          name: 'Juana de Arco',
          url_photo_profile: 'gs://dale-futbol.firebasestorage.app/profile-photos/Profile-2.webp'
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

  constructor(private storage: Storage, private router: Router, private googleMapsServices: GoogleMapsService, 
    private ssService: SessionStorageService,
    @Inject(PLATFORM_ID) private platformId: object
  ){
    console.log("Constructor ejecutado.-")

    this.isBroser = isPlatformBrowser(platformId)

    console.log("Constructor finalizado.-")

  }

  ngOnInit(): void {
    console.log("ngOnInit ejecutado.-") 
    
    // if (this.isBroser) {
    //   console.log("🔴 Angular está en modo SSR, no se puede acceder a sessionStorage aún.");
    //   return;
    // }

    // console.log("✅ Estamos en el navegador, podemos usar sessionStorage.");

    // // Llamamos a cargarDatos() solo si estamos en el navegador
    // this.cargarDatos();

    // setTimeout(() => {
    //   console.log("✅ Estamos en el navegador, podemos usar sessionStorage.");
    //   const cancha = this.ssService.getItem('cancha');
    //   console.log("🎯 Cancha obtenida después de la redirección:", cancha);
    // }, 500);

    const cancha = this.ssService?.getItem('cancha')
    // console.log(cancha)

    if(!cancha){
      console.log("Cancha es undefined")
      location.reload()    
    }else{
      this.cargarDatos()
    }    
    console.log("ngOnInit finalizado.-") 
  }


  ngAfterViewInit(): void {

    console.log("ngAfterViewInit ejecutado.-") 
    console.log("Loading: ",this.loading)
    this.loading = false
    console.log("Loading: ",this.loading)
    console.log("ngAfterViewInit Finalizado.-") 
      
  }


  cargarDatos(){
    console.log("Cargar Datos ejecutado.-")  
    // this.ssService.setItem('prueba','alguna wea')

  //   console.log("sessionStorageService:", this.ssService);
  // console.log("sessionStorageService.getItem('cancha'):", this.ssService?.getItem('cancha'));



    const ssCancha =  this.ssService.getItem('cancha')
    // console.log("paso por ssCancha ",ssCancha)
    const ssHorario =  this.ssService.getItem('horario')
    // console.log("paso por ssHorario ", ssHorario)

    if(ssCancha != null || ssHorario != null){
      this.dataCancha = JSON.parse(String(ssCancha))

      const horario: Horario = JSON.parse(String(ssHorario))

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
          detail: ((this.dataCancha.precio/(this.dataCancha.capacidad))+1500)*1.19
        }
      ]

    
    
    this.initPage()

    
    this.profile_photo = []

    }else{
      console.log("Error al cargar la pagina")
    }
  }

  async initPage(){
    // await this.getPhoto()
    await this.getProfilePhoto()
    await this.buscarDireccion()

    // await this.sleep(3000)

    // this.loading = false
  }

  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  buttonBack(){
    this.router.navigate(['user-main/partidos'])
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

  async getPhoto(){
    if(this.dataCancha.link_image != undefined){
      this.images = await this.dataCancha.link_image
    }else{
      console.log("No se han cargado las imagenes")
    }
    
  }

  getProfilePhoto(){
    const photoProfileRef = ref(this.storage, '/profile-photos')

    listAll(photoProfileRef)
      .then( async (response) => {
        this.profile_photo = []

        for(let item of response.items){
          const url = await getDownloadURL(item)
          this.profile_photo.push(url)
        }


        let i = 0
        for(let team of this.teams){

          for(let player of team.players){
            player.url_photo_profile = this.profile_photo[i]
          }

          i++
        }
      }).catch( (error) => {
        console.log(error)
      })
  }


  redirecToCheckOut(){
    this.router.navigate(['check-out'])
  }

}
