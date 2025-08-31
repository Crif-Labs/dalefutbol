import { isPlatformBrowser } from '@angular/common';
import { booleanAttribute, Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  private datos = {
    banco: 'Banco Estado',
    tipo: 'Cuenta Vista',
    cuenta: '19280532',
    rut: '19.280.532-5',
    nombre: 'Felipe Jara',
    correo: 'fjara9613@gmail.com'
  }

  constructor(@Inject(PLATFORM_ID) private platformID: any) { }

  getDatos(){
    return this.datos;
  }

  async copiarDatos(): Promise<boolean>{
    let datoCopiado: boolean = false

    const texto = 
      `Banco: ${this.datos.banco}\nTipo de cuenta: ${this.datos.tipo}\nNumero de cuenta: ${this.datos.cuenta}\nRUT: ${this.datos.rut}\nNombre: ${this.datos.nombre}\nCorreo: ${this.datos.correo}`

      if(isPlatformBrowser(this.platformID)){
        await navigator.clipboard.writeText(texto).then(async () => {
          datoCopiado = true
        }).catch(err => {
          datoCopiado = this.fallbackCopiar(texto)
        })
      }

      return datoCopiado
  }

  private fallbackCopiar(texto: string):boolean {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed'; // evitar que haga scroll
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true
    } catch (err) {
      document.body.removeChild(textarea);
      return false
    }

    
  }
}
