import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-select',
  imports: [CommonModule],
  templateUrl: './modal-select.component.html',
  styleUrl: './modal-select.component.scss',
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

export class ModalSelectComponent {
  @Input() title: string = 'Titulo'
  @Input() subtitle: string = 'Subtitulo'
  @Input() list: Array<string> = [ "item1", "item2", "item3", "item4", "item5"]
  @Input() itemSelected: string = "item1"

  @Input() textButtonClose: string = 'Cerrar'

  @Output() closed = new EventEmitter<boolean>()
  @Output() item = new EventEmitter<string>()

  close(){
    this.closed.emit(false)
  }

  itemSelection(item: string ){
    this.item.emit(item)
  }


}
