import { Cancha } from "./cancha";

export interface Horario {
    id?: string;
    hora_inicio: string;
    hora_fin: string;
    dia: string;
    cancha_list?: Cancha[]
}
