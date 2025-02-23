import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  constructor() { }

  private apiKey = 'AIzaSyD9ZLmqozedVYkBFQiU_GLQeBFNWLsK7Jc'

  async getCoordenadas(direccion: string): Promise<{lat: number, lng: number} | null> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(direccion)}&key=${this.apiKey}`;

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    if(datos.status === "OK"){
      const {lat, lng} = datos.results[0].geometry.location;
      return {lat, lng}
    }else{
      console.error('No se pudo obtener la ubicacion: ', datos.status)
      return null
    }
  }
}
