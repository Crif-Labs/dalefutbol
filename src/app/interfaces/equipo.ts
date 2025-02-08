export interface Equipo {
    id?: string;
    nombre: string;
    creador: string; // ID del perfil del creador
    jugadores: string[]; // Array de IDs de jugadores
  
}
