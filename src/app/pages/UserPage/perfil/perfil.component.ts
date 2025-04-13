import { Component, OnInit, ElementRef, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { WorkingPageComponent } from "../../../shared/working-page/working-page.component";
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Perfil } from '../../../interfaces/perfil';
import { ComunaService } from '../../../services/comuna.service';
import { Comuna } from '../../../interfaces/comuna';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PerfilService } from '../../../services/perfil.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import * as bootstrap from 'bootstrap'
import { LoadingPageComponent } from "../../../shared/loading-page/loading-page.component";



@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule, LoadingPageComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit{

  // @ViewChild('updateProfileModal') updateProfileModal!: ElementRef;

  perfil!: Perfil

  comunaList: Comuna[] = []

  formPerfil!: FormGroup

  loadingPerfil: boolean = false

  cuentaBancaria: {
    rut: string,
    nombre:string,
    correo: string,
    banco: string,
    tipoCuenta: string,
    numeroCuenta: string
  } = {
    rut: '19280532-5',
    nombre: 'Felipe Jara',
    correo: 'fjara9613@gmail.com',
    banco: 'Banco Estado',
    tipoCuenta: 'Cuenta vista',
    numeroCuenta: '19280532'
  }



  constructor(
    @Inject(PLATFORM_ID) private platformID: any,
    private authService: AuthService, 
    private router: Router,
    private lsService: LocalStorageService,
    private comunaService: ComunaService,
    private perfilService: PerfilService
  ){


  }


  async ngOnInit(){
    const data: string | null = await this.lsService.getItem('perfil')

    if(!data)
      throw new Error('El perfil no esta en LocalStorage');

    this.perfil = await JSON.parse(data)

    this.comunaService.getComunas()
    .subscribe(res => {
      this.comunaList = res.sort((a,b) => a.nombre.localeCompare(b.nombre))
    })

    this.formPerfil = new FormGroup({
      celular: new FormControl(this.perfil.celular, [Validators.required]),
      posicion: new FormControl(this.perfil.posicion, [Validators.required]),
      comuna: new FormControl(this.perfil.comuna, [Validators.required])
    })
  }

  statusCopiedText = ''
  copiarText(text: string){
    if(isPlatformBrowser(this.platformID)){
      navigator.clipboard.writeText(text).then( async () => {
        this.statusCopiedText = await `Dato Copiado!`
      }).catch( err => {
        console.log('text no cpiado: ',err)
      })
    }
  }


  async updatePerfil(){

    this.loadingPerfil = true

    this.perfil.celular = await this.formPerfil.controls['celular'].value
    this.perfil.posicion = await this.formPerfil.controls['posicion'].value
    this.perfil.comuna = await this.formPerfil.controls['comuna'].value

    try {
      await this.perfilService.updatePerfil(String(this.perfil.id), this.perfil)
      console.log('Perfil check!')


      await this.lsService.setItem('perfil', JSON.stringify(this.perfil))
      this.loadingPerfil = false
    } catch (error) {
      throw new Error('No se ha actualizado el perfil.')
    }

  }

  clearStatusCopiedText(){
    this.statusCopiedText = ''
  }

  async onLogout(){
    await this.authService.logout()

    this.router.navigate(['/login'])
  }

}
