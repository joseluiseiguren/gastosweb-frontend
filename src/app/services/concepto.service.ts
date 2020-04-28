import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UrlService } from './url.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ConceptoService {

    constructor(
            private _http: HttpClient,
            private _urlService: UrlService) { }

    getConceptos(): Observable<any[]> {
        return this._http.get<any[]>(this._urlService.urlGetConceptos())
                        .pipe(tap(data => JSON.stringify(data)));
    }

    insertConcepto(descripcion: string, credito: boolean): Observable<void> {
        return this._http.post<any>(this._urlService.urlInsertConcepto(),
                {descripcion: descripcion,
                 credito: credito});
    }

    updateConcepto(idConcepto: string, descripcion: string, credito: boolean): Observable<void> {
        return this._http.put<any>(this._urlService.urlUpdateConcepto(),
                {descripcion: descripcion,
                 credito: credito,
                 idconcepto: idConcepto});
    }
}
