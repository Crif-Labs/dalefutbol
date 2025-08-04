import { Component } from '@angular/core';
import { ModalLoadingComponent } from "../../../shared/ModalDir/modal-loading/modal-loading.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  imports: [CommonModule, ModalLoadingComponent],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.scss'
})
export class EstadisticasComponent {

}
