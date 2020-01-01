import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import { IConceptoDiario } from '../models/concepto.diario';
import { UsersService } from './users.service';
import { UrlService } from './url.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class DiarioService {
  
  constructor(private _http: HttpClient,
              private _urlService: UrlService) { }

  getConceptosImportes(fecha: Date): Observable<IConceptoDiario[]> {
    let url = this._urlService.urlGetConceptosImportes(
                                      fecha.getFullYear().toString() + 
                                      (fecha.getMonth()+1).toString().padStart(2, '0') + 
                                      fecha.getDate().toString().padStart(2, '0'));
    
    return this._http.get<IConceptoDiario[]>(url)
                    //.delay(3000)
                    .pipe(tap(data => JSON.stringify(data)));
  }

  setConceptoImporte(fecha:Date, importe:number, idConcepto:number) : Observable<void> {
    return this._http.post<any>(this._urlService.urlSetConceptoImporte(), 
            {fecha: fecha.getFullYear().toString() + 
                    (fecha.getMonth()+1).toString().padStart(2, '0') + 
                    fecha.getDate().toString().padStart(2, '0'), 
              importe: importe, 
              idConcepto: idConcepto});
  }

  getPrimerConsumo(): Observable<any> {
    return this._http.get<Date>(this._urlService.urlGetPrimerConsumo())
                  //.delay(3000)
                  .pipe(tap(data => JSON.stringify(data)));
  }

  getConceptosTotalMes(fecha: string /*YYYYMM*/): Observable<any[]> {
    return this._http.get<any[]>(this._urlService.urlGetConceptosTotalMes(fecha))
                  //.delay(3000)
                  .pipe(tap(data => JSON.stringify(data)));
  }

  getConceptosMovimMes(idConcepto: string, fecha: string /*YYYYMM*/): Observable<any[]> {
    return this._http.get<any[]>(this._urlService.urlGetConceptosMovimMes(idConcepto, fecha))
                    //.delay(3000)
                    .pipe(tap(data => JSON.stringify(data)));
  }

  getConceptosTotalAnio(anio: number /*YYYY*/): Observable<any[]> {
    return this._http.get<any[]>(this._urlService.urlGetConceptosTotalAnio(anio))
                  //.delay(3000)
                  .pipe(tap(data => JSON.stringify(data)));
  }

  getConceptosMovimAnio(idConcepto: string, anio: number /*YYYY*/): Observable<any[]> {
    return this._http.get<any[]>(this._urlService.urlGetConceptosMovimAnio(idConcepto, anio))
                    //.delay(3000)
                    .pipe(tap(data => JSON.stringify(data)));
  }

  getConceptosTotalHistorico(): Observable<any[]> {
    return this._http.get<any[]>(this._urlService.urlGetConceptosTotalHistorico())
                  //.delay(3000)
                  .pipe(tap(data => JSON.stringify(data)));
  }

  getConceptosMovimHistorico(idConcepto: string): Observable<any[]> {
    return this._http.get<any[]>(this._urlService.urlGetConceptosMovimHistorico(idConcepto))
                    //.delay(3000)
                    .pipe(tap(data => JSON.stringify(data)));
  }
}
