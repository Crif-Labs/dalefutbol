import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-support',
  imports: [ReactiveFormsModule],
  templateUrl: './modal-support.component.html',
  styleUrl: './modal-support.component.scss'
})
export class ModalSupportComponent {

  @Output() closed = new EventEmitter<boolean>()
  @Output() description = new EventEmitter<string>()

  formSupport: FormGroup = new FormGroup({
    description: new FormControl('', Validators.required)
  })

  constructor(){}

  sendDescription(){
    this.formSupport.controls['description'].valid ?
      this.description.emit(this.formSupport.controls['description'].value) :
      console.log('Descripcion vacia')
  }

  close(){
    this.closed.emit(false)
  }
}
