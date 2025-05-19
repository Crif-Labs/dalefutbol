import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PerfilService } from '../../../services/perfil.service';
import { ModalLoadingComponent } from "../../../shared/ModalDir/modal-loading/modal-loading.component";
import { CommonModule } from '@angular/common';
import { ModalResponseComponent } from "../../../shared/ModalDir/modal-response/modal-response.component";

@Component({
  selector: 'app-user',
  imports: [RouterOutlet, ModalLoadingComponent, CommonModule, ModalResponseComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  UID: any

  showLoadModal: boolean = true
  showModalResponse: boolean = false

  constructor(private authService: AuthService, private perfilService: PerfilService, private router: Router){

    try {
      this.authService.getAuth().subscribe(res => {
        
        this.perfilService.getRolPerfil(String(res?.uid))
          .then(res => {
            
            if(res){
              this.showLoadModal = false
            }else{
              this.showLoadModal = false
              this.showModalResponse = true
            }

          }).catch(error => {
            console.log(error)
          })
      })
    } catch (error) {
      console.log('error')
    }    
  }

  closeModal(response: boolean){
    console.log(response)

    if(response){
      this.router.navigate(['/register-profile'])
    }else{
      this.authService.logout()

      this.router.navigate(['/login'])
    }
  }
}
