import { Component } from '@angular/core';
import { WorkingPageComponent } from "../../../shared/working-page/working-page.component";
import { ModalLoadingComponent } from "../../../shared/ModalDir/modal-loading/modal-loading.component";
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-equipo',
  imports: [CommonModule, ModalLoadingComponent, ReactiveFormsModule],
  templateUrl: './equipo.component.html',
  styleUrl: './equipo.component.scss'
})
export class EquipoComponent {

  showModalLoading: boolean = false
  selectOption: number = 1

  inputFormCreateEquipo = [
    {
      name: 'nombre',
      type: 'text',
      placeholder: 'Nombre Equipo',
      required: true,
      icon: 'fa-solid fa-signature',
      error: 'Nombre del equipo es necesario'
    },
    {
      name: 'descripcion',
      type: 'text',
      placeholder: 'Descripcion Equipo',
      required: false,
      icon: 'fa-solid fa-pen',
      error: 'Descripcion del equipo es necesario'
    },
    {
      name: 'color',
      type: 'text',
      placeholder: 'Color de Equipo',
      required: false,
      icon: 'fa-solid fa-pen',
      error: 'Descripcion del equipo es necesario'
    }
  ]


  formCreateEquipo: FormGroup;

  constructor(){
    this.formCreateEquipo = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', []),
      color: new FormControl('', [])
    })
  }

  changeOption(option: number){
    this.selectOption = option

    switch(option){
      case 1:
        console.log("Unirse");
        break;
      case 2:
        console.log("Buscar");
        break;
      case 3:
        console.log("Crear");
        break;
      default:
        this.selectOption = 1
        console.log("Unirse");
        break;

    }
  }

}
