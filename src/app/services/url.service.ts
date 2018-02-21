import { Injectable } from '@angular/core';

@Injectable()
export class UrlService {
    private _host: string = "http://localhost:3000/";

    constructor() { }

    urlGetConceptos(): string {
        return this._host + "api/usuarios/conceptos";
    }
    
    urlInsertConcepto(): string {
        return this._host + "api/concepto";
    }

    urlUpdateConcepto(): string {
        return this._host + "api/concepto";
    }

    urlGetConceptosImportes(fecha: string): string {
        return this._host + "api/diario/" + fecha;
    }

    urlSetConceptoImporte(): string {
        return this._host + "api/diario";
    }

    urlGetPrimerConsumo(): string {
        return this._host + "api/diario/first";
    }

    urlGetConceptosTotalMes(fecha: string): string {
        return this._host + "api/conceptos/sumary/" + fecha;
    }

    urlGetConceptosMovimMes(idConcepto: number, fecha: string): string {
        return this._host + "api/conceptos/" + idConcepto.toString() + "/movimientos/" + fecha;
    }

    urlGetSumaryMensual(fecha: string): string {
        return this._host + "api/mensual/" + fecha + "/sumary";
    }

    urlLogin(): string {
        return this._host + "api/usuarios/login";
    }

    urlRegistracion(): string {
        return this._host + "api/usuarios/registracion";
    }
}
