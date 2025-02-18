import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Storage, ref, listAll, getDownloadURL  } from '@angular/fire/storage';

@Component({
  selector: 'app-reserva',
  imports: [CommonModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.scss'
})
export class ReservaComponent {

  images: string[];

  constructor(private storage: Storage){
    this.getPhoto()
    this.images = []
  }

  getPhoto(){
    const imageRef = ref(this.storage, '/MaiClub-LaFlorida/Carrousel');

    listAll(imageRef)
      .then( async (response) => {
        this.images = []

        for (let item of response.items) {
           const url = await getDownloadURL(item)
           this.images.push(url)
            
        }

        console.log( this.images)

      }).catch( (error) => {
        console.log(error)
      })

    
  }

}
