import { Timestamp } from "@angular/fire/firestore";
import { Perfil } from "./perfil";

export interface Equipo {
    id: string;
    nombre: string;
    descripcion?: string;
    color: string;
    creacion: Timestamp;
}
