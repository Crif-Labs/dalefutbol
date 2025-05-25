import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cancha } from '../../../interfaces/cancha';
import { Reserva } from '../../../interfaces/reserva';
import { Horario } from '../../../interfaces/horario';
import { Perfil } from '../../../interfaces/perfil';
import { CommonModule, DatePipe } from '@angular/common';
import { ReservaService } from '../../../services/reserva.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { SessionStorageService } from '../../../services/session-storage.service';
import { Reserva2 } from '../../../interfaces/reserva-2';
import { PerfilService } from '../../../services/perfil.service';
import { Timestamp } from 'firebase/firestore';
import { ModalResponseComponent } from "../../../shared/ModalDir/modal-response/modal-response.component";
import { ModalResponse } from '../../../interfaces/modal-response';
import { ModalLoadingComponent } from "../../../shared/ModalDir/modal-loading/modal-loading.component";
import { ModalConditionTermsComponent } from "../../../shared/ModalDir/modal-condition-terms/modal-condition-terms.component";

@Component({
  selector: 'app-check-out',
  imports: [CommonModule, ModalResponseComponent, ModalLoadingComponent, ModalConditionTermsComponent],
  templateUrl: './check-out.component.html',
  styleUrl: './check-out.component.scss'
})
export class CheckOutComponent {

  cancha: Cancha = {
    id: '123',
    nombre: 'SuperCancha',
    direccion: 'El Quillay 1168',
    comuna: 'La Pintana',
    capacidad: 16,
    capacidad_equipo: '7',
    precio: 4500
  }

  horario: Horario = {
    id: '321',
    hora_inicio: '22:00',
    hora_fin: '23:00',
    dia: '',
  }  
  
  perfil: Perfil ={
    id: '123123',
    nombre: 'Cristobal',
    apellido: 'Riquelme',
    celular: '',
    rol: 'jugador',
    posicion: "Central",
    id_usuario: '456'
  }

  reserva!: Reserva2 


  date = ''
  descuento = 0

  confirm: boolean = false

  colorTeam: string = ''

  loading: boolean = false

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

  whatsapp = '56933021601'

  showModalResponse: boolean = false
  showModalButtonClose: boolean = false
  modalResponse: ModalResponse = {
    title: '',
    subtitle: '',
    message: '',
    textButtonSuccess: 'Aceptar',
    textButtonClose: 'Cerrar'
  }


  showModalConditionTerms: boolean = false

  constructor(
    private router: Router, 
    private dataRoute: ActivatedRoute, 
    private perfilService: PerfilService, 
    private reservaService: ReservaService, 
    private localStorageService: LocalStorageService, 
    private sessionStorageService: SessionStorageService){
    if(localStorageService.getItem('perfil') != null || sessionStorageService.getItem('cancha') != null || sessionStorageService.getItem('horario')){

      dataRoute.queryParams.subscribe( params => {
        this.colorTeam = params['color']
      })

      this.cancha = JSON.parse(String(sessionStorageService.getItem('cancha')))

      this.cancha.precio = Math.ceil(((this.cancha.precio/this.cancha.capacidad)+1500)*1.19 / 100)*100

      this.perfil = JSON.parse(String(localStorageService.getItem('perfil')))

      this.horario = JSON.parse(String(sessionStorageService.getItem('horario')))

      this.horario.cancha_list = []

      const datePipe = new DatePipe('es-CL')

      this.date = String(datePipe.transform(this.horario.dia, 'dd/MM'))

      const localDate = new Date()

      this.reserva = {
        fecha_reserva: Timestamp.fromDate(localDate),
        hora_reserva: localDate.toTimeString().split(' ')[0].slice(0, 5),
        responsable: this.perfil,
        color: this.colorTeam,
        estado: 'Pendiente',
        cancha_id: String(this.cancha.id),
        horario_id: String(this.horario.id)
      }

    }else{
      console.log("Problemas en la lectura de datos")
    }
  }

  async addReserva(){
    // this.loading = true

    if(!this.confirm){
      this.modalResponse = {
        title: 'Ups!',
        subtitle: 'Leíste los términos y condiciones?',
        message: 'Recuerda que debes aceptar los términos y condiciones. Después, deberás seguir las instrucciones',
        textButtonSuccess: 'Aceptar',
        textButtonClose: 'Cerrar'
      }
      this.showModalResponse = true
    }else{
      this.loading = true
      try {
        const newReserva = await this.reservaService.addReserva(String(this.cancha.id), String(this.horario.id), String(this.perfil.id), this.reserva)
        
        if(!newReserva){
          console.log("❌ No se pudo realizar la reserva.");
          return;
        }
  
        const text =
        `*ID:* ${this.perfil.id}\n`+
        `*Usuario:* ${this.perfil.nombre} ${this.perfil.apellido}\n`+
        `*Reserva:* ${newReserva.id}\n`+
        `*Monto:* ${this.cancha.precio}\n\n`+
        `* *Recuerda subir tu voucher para confirmar la reserva*`
  
        const url = `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(text)}`;
  
        // console.log("✅ Reserva completada con éxito:", newReserva);
  
        window.open(url, '_blanck')
  
        this.loading = false
  
        this.router.navigate(['/user','main','partidos']);
  
      } catch (error) {
        this.modalResponse = {
          title: 'Error ❌',
          subtitle: 'CODIGO: CheckOut301',
          message: 'Ha ocurrido un error inesperado, por favor contáctese con servico al cliente',
          textButtonSuccess: 'Aceptar',
          textButtonClose: 'Cerrar'
        }
        this.loading = false
        this.showModalResponse = true
        console.log("❌ Error en el proceso de reserva:", error);
      }
    }


  }

  _showModal(){
    this.showModalConditionTerms = true
  }

  closeModal(){
    this.showModalResponse = false
    this.showModalConditionTerms = false
  }


  buttonBack(){
    this.router.navigate(['/user','reservas-check-in'])
  }

}
