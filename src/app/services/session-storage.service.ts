import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  setItem(key: string, value: string){
    if (isPlatformBrowser(this.platformId)){
      sessionStorage.setItem(key, value)
    }else {
      console.log("❌ Error al ingresar dato a sessionStorage") 
    }
  }

  getItem(key: string): string | null {
    if(isPlatformBrowser(this.platformId)) { 
      // console.log("Obteniendo el item ss")
      return sessionStorage.getItem(key)
    }

    return null;
  }
}
