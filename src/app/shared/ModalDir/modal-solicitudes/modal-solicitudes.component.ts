import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notificacion } from '../../../interfaces/notificacion';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-solicitudes',
  imports: [CommonModule],
  templateUrl: './modal-solicitudes.component.html',
  styleUrl: './modal-solicitudes.component.scss',
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
export class ModalSolicitudesComponent {
  @Input() title: string = 'Solicitudes'
  @Input() textButtonClose: string = 'Cerrar'
  @Input() uid: string | null = null
  @Input() list: any[] = [
    {
      idSolicitud: '123123',
      nombre: 'Nombre',
      apellido: 'Apellido',
      posicion: 'Delantero',
      comuna: 'La Pintana',
      idEquipo: '987987',
      idPerfil: ''
    },
    {
      idSolicitud: '123123',
      nombre: 'Nombre',
      apellido: 'Apellido',
      posicion: 'Defensa',
      comuna: 'Las Condes',
      idEquipo: '987987',
      idPerfil: ''
    },
  ]

  @Output() closed = new EventEmitter<boolean>()
  @Output() validar = new EventEmitter<boolean>()

  

  constructor(){
  }

  close(){
    this.closed.emit(false)
  }

  validacion(solicitud: any){
    this.validar.emit(solicitud)
  }
}
