import { Cancha } from "./cancha";
import { Equipo } from "./equipo";
import { Horario } from "./horario";
import { Perfil } from "./perfil";

export interface Reserva {
    id?: string;
    fecha: string;
    hora_inicio: string;
    color: string;
    reservadoPor: [
      {
        responsable: Perfil | Equipo | 'admin',
        estado: 'pendiente' | 'confirmada' | 'cancelada';
      }
    ];
    cancha: Cancha;
    horario: Horario;
}
