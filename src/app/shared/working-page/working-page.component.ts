import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-working-page',
  imports: [],
  templateUrl: './working-page.component.html',
  styleUrl: './working-page.component.scss'
})
export class WorkingPageComponent {

  @Input() namePage: string = 'pagina'

}
