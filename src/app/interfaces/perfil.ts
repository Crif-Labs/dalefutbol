export interface Perfil {
    id?: string;
    nombre: string;
    apellido: string;
    posicion: string;
    celular: string;
    comuna: string;
    rol: 'admin' | 'jugador'; // Asegura que el rol solo pueda ser 'admin' o 'jugador'
    id_usuario: string;
}
