import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import { SumaryAnio } from '../models/sumaryanio';
import { UrlService } from './url.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class SumaryAnioService {
  
  constructor(private _http: HttpClient, 
              private _urlService: UrlService) { }

  getSumary(fecha: Date): Observable<SumaryAnio> {
    return this._http.get<SumaryAnio>(this._urlService.urlGetSumaryAnual(fecha.getFullYear().toString()))
                    //.delay(5000)
                    .pipe(tap(data => JSON.stringify(data)));
  }
}