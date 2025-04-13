import { Timestamp } from "@angular/fire/firestore";
import { Equipo } from "./equipo";
import { Perfil } from "./perfil";

export interface Reserva2 {
    id?: string;
    fecha_reserva: Timestamp;
    hora_reserva: string;
    responsable: Perfil | Equipo, //| 'admin',
    estado: 'Pendiente' | 'Confirmado' | 'Cancelado';
    color: string;
    cancha_id: string;
    horario_id: string;
}