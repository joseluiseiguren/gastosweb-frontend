import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SumaryAnio } from '../models/sumaryanio';
import { UrlService } from './url.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class SumaryAnioService {

  constructor(private _http: HttpClient,
              private _urlService: UrlService) { }

  getSumary(fecha: Date): Observable<SumaryAnio> {
    return this._http.get<SumaryAnio>(this._urlService.urlGetSumaryAnual(fecha.getFullYear().toString()))
                    .pipe(tap(data => JSON.stringify(data)));
  }
}
