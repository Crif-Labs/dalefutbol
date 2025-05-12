import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import animationData from '../../../assets/balon.json'
import { LottieComponent } from 'ngx-lottie'

@Component({
  selector: 'app-modal',
  imports: [CommonModule, LottieComponent],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
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

export class ModalComponent {
  @Input() title: string = 'Titulo por defecto'
  @Input() message: string = 'Mensaje por defecto';
  @Input() closeButton: boolean = true;
  @Output() closed = new EventEmitter<void>();


  options = {
    animationData,
    loop: true,
    autoplay: true
  }

  close() {
    this.closed.emit();
  }
}
