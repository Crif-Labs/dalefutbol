export interface Notificacion {
    id?: string;          // ID del usuario que recibirá la notificación
    mensaje: string;
    leido: boolean;
    fecha: Date;
    tipo?: string;         // Ej: 'reserva', 'sistema', etc.
    referenciaId?: string; // ID del documento relacionado
}
