import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import { IConceptoDiario } from '../models/concepto.diario';
import { UsersService } from './users.service';

@Injectable()
export class DiarioService {
  
  constructor(private _http: HttpClient, private _userService: UsersService) { }

  getConceptosImportes(fecha: Date): Observable<IConceptoDiario[]> {
    let url = 'http://localhost:3000/api/usuarios/:userId/diario/:fecha';
    url = url.replace(":userId", this._userService.getUserId().toString());
    url = url.replace(":fecha", fecha.getFullYear().toString() + 
                                (fecha.getMonth()+1).toString().padStart(2, '0') + 
                                fecha.getDate().toString().padStart(2, '0'));

    return this._http.get<IConceptoDiario[]>(url)
                    //.delay(3000)
                    .do(data => JSON.stringify(data))
                    .catch(this.handleError);
  }

  setConceptoImporte(fecha:Date, importe:number, idConcepto:number) : Observable<void> {
    
    return this._http.post<any>('http://localhost:3000/api/diario', 
            {fecha: fecha.getFullYear().toString() + 
                    (fecha.getMonth()+1).toString().padStart(2, '0') + 
                    fecha.getDate().toString().padStart(2, '0'), 
              importe: importe, 
              idConcepto: idConcepto});
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
