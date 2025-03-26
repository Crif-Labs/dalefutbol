import { Equipo } from "./equipo";
import { Perfil } from "./perfil";

export interface Reserva2 {
    id?: string;
    fecha_reserva: string;
    hora_reserva: string;
    responsable: Perfil | Equipo | 'admin',
    estado: 'pendiente' | 'confirmada' | 'cancelada';
}
