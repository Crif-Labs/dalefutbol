import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import localeEsCL from '@angular/common/locales/es-CL'

registerLocaleData(localeEsCL, 'es-CL')

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {provide: LOCALE_ID, useValue: 'es-CL'}
  ]
})
export class AppComponent {
  title = 'dalefutbol';
}
