export interface Reserva {
    id?: string;
    fecha: string;
    estado: 'pendiente' | 'confirmada' | 'cancelada';
    reservadoPor: {
      tipo: 'jugador' | 'equipo';
      id: string;
      jugadores?: string[]; // Solo si es un equipo
    };
    id_cancha: string;
    id_horario: string;
}
