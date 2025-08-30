import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

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

  copiarDatos(){
    const texto = 
      `Banco: ${this.datos.banco}
      Tipo de cuenta: ${this.datos.tipo}
      Numero de cuenta: ${this.datos.cuenta}
      RUT: ${this.datos.rut}
      Nombre: ${this.datos.nombre}
      Correo: ${this.datos.correo}`

      if(isPlatformBrowser(this.platformID)){
        navigator.clipboard.writeText(texto).then(async () => {
          alert('Texto Copiado')
        }).catch(err => {
          console.log('Texto no copiado: ',err)
          this.fallbackCopiar(texto)
        })
      }
  }

  private fallbackCopiar(texto: string): void {
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    textarea.style.position = 'fixed'; // evitar que haga scroll
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand('copy');
      alert('Texto copiado ✅');
    } catch (err) {
      console.error('Error al copiar: ', err);
    }

    document.body.removeChild(textarea);
  }
}
