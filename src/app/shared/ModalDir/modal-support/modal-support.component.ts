import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-support',
  imports: [],
  templateUrl: './modal-support.component.html',
  styleUrl: './modal-support.component.scss'
})
export class ModalSupportComponent {
  @Input() title: string = 'Soporte'
  @Input() textButtonClose: string = 'Cerrar'

  @Output() closed = new EventEmitter<boolean>()
  // @Output() validar = new EventEmitter<boolean>()

  close(){
    this.closed.emit(false)
  }
}
