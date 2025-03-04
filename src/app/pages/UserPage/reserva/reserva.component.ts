import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Storage, ref, listAll, getDownloadURL  } from '@angular/fire/storage';
import { Cancha } from '../../../interfaces/cancha';
import {GoogleMap, GoogleMapsModule, MapGeocoder} from '@angular/google-maps';
import { GoogleMapsService } from '../../../services/google-maps.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingPageComponent } from "../../../shared/loading-page/loading-page.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-reserva',
  imports: [CommonModule, GoogleMap, FormsModule, GoogleMapsModule, LoadingPageComponent],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.scss'
})
export class ReservaComponent {

  center = { lat: 0, lng: 0 }; // Ejemplo: Santiago, Chile
  zoom = 13;
  markerPosition = this.center
  adress = 'Parque Deportivo La Araucana, Walker Martínez 2295, La Florida'
  
  loading: Boolean = true

  images: string[];
  profile_photo: string[];

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

  dataReserva = [
    {
      icon: 'fa-solid fa-stopwatch',
      detail: '21:00 hr'
    },
    {
      icon: 'fa-solid fa-calendar-days',
      detail: '11/02'
    },
    {
      icon: 'fa-regular fa-hourglass-half',
      detail: '60 min'
    },
    {
      icon: 'fa-solid fa-dollar-sign',
      detail: this.dataCancha.precio
    }
  ]

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

  constructor(private storage: Storage, private googleMapsServices: GoogleMapsService, private router: Router){
    this.initPage()
    this.images = []
    this.profile_photo = []
  }

  async initPage(){
    await this.getPhoto()
    await this.getProfilePhoto()
    await this.buscarDireccion()

    // await this.sleep(3000)

    this.loading = false
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
    const imageRef = ref(this.storage, '/MaiClub-LaFlorida/Carrousel');

    await listAll(imageRef)
      .then( async (response) => {
        this.images = []

        for (let item of response.items) {
           const url = await getDownloadURL(item)
           await this.images.push(url)
            
        }

      }).catch( (error) => {
        console.log(error)
      })

    console.log(this.images)
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
