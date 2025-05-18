import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-response',
  imports: [CommonModule],
  templateUrl: './modal-response.component.html',
  styleUrl: './modal-response.component.scss',
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
export class ModalResponseComponent {

  @Input() title: string = 'Titulo'
  @Input() subtitle: string = 'Subtitulo'
  @Input() message: string = 'Message...'

  @Input() textButtonSuccess: string = 'Aceptar'
  @Input() textButtonClose: string = 'Cerrar'

  @Output() closed = new EventEmitter<boolean>()

  closeSuccess(response: boolean){
    this.closed.emit(response)
  }

}
