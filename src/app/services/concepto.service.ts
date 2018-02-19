import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import { IConcepto } from '../models/concepto';
import { UsersService } from './users.service';

@Injectable()
export class ConceptoService {
  
    constructor(private _http: HttpClient) { }

    getConceptos(): Observable<any[]> {
        let url = 'http://localhost:3000/api/usuarios/conceptos';
        
        return this._http.get<any[]>(url)
                        //.delay(3000)
                        .do(data => JSON.stringify(data))
                        .catch(this.handleError);
    }

    insertConcepto(descripcion:string, credito:boolean) : Observable<void> {
    
        return this._http.post<any>('http://localhost:3000/api/concepto', 
                {descripcion: descripcion, 
                 credito: credito});
    }

    updateConcepto(idConcepto: number, descripcion:string, credito:boolean) : Observable<void> {
    
        return this._http.put<any>('http://localhost:3000/api/concepto', 
                {descripcion: descripcion, 
                 credito: credito,
                 idconcepto: idConcepto});
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
