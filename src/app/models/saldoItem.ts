export class ISaldoItem {
    title: string;
    icon: string;
    ingresos: number;
    egresos: number;
    concept: string;
    date: Date;

    constructor(title: string, icon: string, ingresos: number, egresos: number, concept: string, date: Date){
        this.title = title;
        this.ingresos = ingresos;
        this.egresos = egresos;
        this.icon = icon;
        this.concept = concept;
        this.date = date;
    }
}
