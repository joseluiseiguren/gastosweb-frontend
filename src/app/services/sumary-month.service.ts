import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SumaryMonth } from '../models/sumarymonth';
import { UrlService } from './url.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class SumaryMonthService {

  constructor(private _http: HttpClient,
              private _urlService: UrlService) { }

  getSumary(fecha: Date): Observable<SumaryMonth> {
    const year = fecha.getFullYear().toString();
    return this._http.get<SumaryMonth>(this._urlService.urlGetSumaryMensual(year + (fecha.getMonth() + 1).toString().padStart(2, '0')))
                    .pipe(tap(data => JSON.stringify(data)));
  }
}
