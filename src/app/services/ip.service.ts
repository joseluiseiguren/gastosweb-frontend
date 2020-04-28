import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class IpService {

  constructor(private _http: HttpClient) { }

  getClientIp(): Observable<any> {
    // let url = "http://freegeoip.net/json/";
    const url = 'https://ipapi.co/json/';

    return this._http.get(url)
                    .pipe(tap(data => JSON.stringify(data)));
  }
}
