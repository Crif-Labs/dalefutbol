import { Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-modal-condition-terms',
  imports: [CommonModule],
  templateUrl: './modal-condition-terms.component.html',
  styleUrl: './modal-condition-terms.component.scss',
  animations: [
    trigger('fadeBackdrop', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeModal', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ],
})
export class ModalConditionTermsComponent {
  @Input() title: string = 'Términos y Condiciones'
  @Input() subtitle: string = 'Sigue también las instrucciones'

  @Input() textButtonClose: string = 'Cerrar'

  @Output() closed = new EventEmitter<boolean>()

  constructor(@Inject(PLATFORM_ID) private platformID: any){}

  cuentaBancaria: {
    rut: string,
    nombre:string,
    correo: string,
    banco: string,
    tipoCuenta: string,
    numeroCuenta: string
  } = {
    rut: '19280532-5',
    nombre: 'Felipe Jara',
    correo: 'fjara9613@gmail.com',
    banco: 'Banco Estado',
    tipoCuenta: 'Cuenta vista',
    numeroCuenta: '19280532'
  }

  close(){
    this.closed.emit(false)
  }

  statusCopiedText = ''
  copiarText(text: string){
    if(isPlatformBrowser(this.platformID)){
      navigator.clipboard.writeText(text).then( async () => {
        this.statusCopiedText = await `Dato Copiado!`
      }).catch( err => {
        console.log('text no copiado: ',err)
      })
    }
  }
  clearStatusCopiedText(){
    this.statusCopiedText = ''
  }
}
