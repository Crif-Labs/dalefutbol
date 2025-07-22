export interface Solicitudes {
    id: string;
    estado: 'Aprobada' | 'Rechazada' | 'En proceso';
    idEquipo: string,
    idPerfil: string
}
