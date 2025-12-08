import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import localeEsCL from '@angular/common/locales/es-CL';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Capacitor } from '@capacitor/core';
import { PushNotificationService } from './services/push-notification.service';
import { ModalResponseComponent } from "./shared/ModalDir/modal-response/modal-response.component";

registerLocaleData(localeEsCL, 'es-CL')

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ModalResponseComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {provide: LOCALE_ID, useValue: 'es-CL'}
  ]
})
export class AppComponent implements OnInit{
  title = 'dalefutbol';
  showModalResponseNotification: boolean = false
  titleNoti = ''
  bodyNoti = ''

  constructor(private pushService: PushNotificationService){
    GoogleAuth.initialize();
  }

  async ngOnInit() {
    await this.pushService.requestPermissionAndSave()
    this.pushService.listenMessages()

  }

  closeModalResponseNotification(){
    this.showModalResponseNotification = false
  }
}
