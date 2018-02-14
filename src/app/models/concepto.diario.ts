import { IConcepto } from "./concepto";

export interface IConceptoDiario {
    idconcepto: number;
    descripcion: string;
    credito: number;
    fecha: Date;
    importe: number;
}

