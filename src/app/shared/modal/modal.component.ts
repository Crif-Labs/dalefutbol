import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { LoadingPageComponent } from "../loading-page/loading-page.component";
import { SimpleLoadingComponent } from "../simple-loading/simple-loading.component";

@Component({
  selector: 'app-modal',
  imports: [CommonModule, SimpleLoadingComponent],
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
  @Input() loadModal: boolean = false;
  @Input() closeButton: boolean = true;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
