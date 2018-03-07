import { Injectable } from '@angular/core';

@Injectable()
export class UrlService {
    //private _host: string = "http://localhost:3000/";
    private _host: string = "http://controlgastos.eu-4.evennode.com:80";

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
        return this._host + "api/conceptos/mensual/" + fecha + "/sumary";
    }

    urlGetConceptosMovimMes(idConcepto: number, fecha: string): string {
        return this._host + "api/conceptos/" + idConcepto.toString() + "/movimientos/mensual/" + fecha;
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

    urlUserUpdateProfile(): string {
        return this._host + "api/usuario";
    }

    urlGetSumaryAnual(fecha: string): string {
        return this._host + "api/anual/" + fecha + "/sumary";
    }

    urlGetConceptosTotalAnio(anio: number): string {
        return this._host + "api/conceptos/anual/" + anio.toString() + "/sumary";
    }

    urlGetConceptosMovimAnio(idConcepto: number, anio: number): string {
        return this._host + "api/conceptos/" + idConcepto.toString() + "/movimientos/anual/" + anio.toString();
    }

    urlGetUserProfile(idUsuario: number): string {
        return this._host + "api/usuarios/" + idUsuario.toString();
    }

    urlGetSumaryHistorico(): string {
        return this._host + "api/historico/sumary";
    }

    urlGetConceptosTotalHistorico(): string {
        return this._host + "api/conceptos/historico/sumary";
    }

    urlGetConceptosMovimHistorico(idConcepto: number): string {
        return this._host + "api/conceptos/" + idConcepto.toString() + "/movimientos/historico";
    }
}
