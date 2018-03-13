import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';

@Injectable()
export class IpService {
  
  constructor(private _http: HttpClient) { }

  getClientIp(): Observable<any> {
    let url = "http://freegeoip.net/json/";
    
    return this._http.get(url)
                    .do(data => JSON.stringify(data))
  }

  
}
