export class ISaldoItem {
    title: string;
    icon: string;
    ingresos: number;
    egresos: number;

    constructor(title: string, icon: string, ingresos: number, egresos: number){
        this.title = title;
        this.ingresos = ingresos;
        this.egresos = egresos;
        this.icon = icon;
    }
}
