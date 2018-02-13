import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import { IConceptoDiario } from '../models/concepto.diario';

@Injectable()
export class DiarioService {
  private _conceptosDiarioUrl = 'http://localhost:3000/api/usuarios/:userId/diario/:fecha';

  constructor(private _http: HttpClient) { }

  getConceptosImportes(fecha: Date, userId: number): Observable<IConceptoDiario[]> {
    let url = this._conceptosDiarioUrl.replace(":userId", userId.toString());
    url = url.replace(":fecha", fecha.getFullYear().toString() + "-" + (fecha.getMonth()+1).toString() + "-" +  fecha.getDate().toString());

    return this._http.get<IConceptoDiario[]>(url)
                    //.delay(3000)
                    .do(data => JSON.stringify(data))
                    .catch(this.handleError);
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof Error) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMessage = `An error occurred: ${err.error.message}`;
    } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }

}
