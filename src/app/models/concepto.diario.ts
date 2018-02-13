import { IConcepto } from "./concepto";

export interface IConceptoDiario {
    idconcepto: number;
    descripcion: string;
    credito: boolean;
    fecha: Date;
    importe: number;
}

