import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notificacion } from '../../../interfaces/notificacion';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-notification',
  imports: [CommonModule],
  templateUrl: './modal-notification.component.html',
  styleUrl: './modal-notification.component.scss',
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
export class ModalNotificationComponent {
  @Input() title: string = 'Notificaciones'
  @Input() textButtonClose: string = 'Cerrar'
  @Input() uid: string | null = null
  @Input() list: Notificacion[] = [
    {
      id: '123123',
      mensaje: 'Mensaje generico 1',
      leido: false,
      fecha: new Date(),
      tipo: 'Generica',
      referenciaId: '987987',
    },
    {
      id: '321321',
      mensaje: 'Mensaje generico 2',
      leido: true,
      fecha: new Date(),
      tipo: 'Generica',
      referenciaId: '789789',
    }
  ]

  @Output() closed = new EventEmitter<boolean>()

  constructor(){
  }



  close(){
    this.closed.emit(false)
  }

}
