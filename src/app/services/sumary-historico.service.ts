import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import { SumaryHistorico } from '../models/sumaryhistorico';
import { UrlService } from './url.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class SumaryHistoricoService {
  
  constructor(private _http: HttpClient, 
              private _urlService: UrlService) { }

  getSumary(): Observable<SumaryHistorico> {
    return this._http.get<SumaryHistorico>(this._urlService.urlGetSumaryHistorico())
                    //.delay(5000)
                    .pipe(tap(data => JSON.stringify(data)));
  }
}