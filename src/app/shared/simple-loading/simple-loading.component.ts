import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-simple-loading',
  imports: [],
  templateUrl: './simple-loading.component.html',
  styleUrl: './simple-loading.component.scss'
})
export class SimpleLoadingComponent {

  @Input() message: string = 'Cargando...'

}
