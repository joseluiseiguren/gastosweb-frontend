import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { AuthInterceptor } from '../interceptors/AuthInterceptor';

@Injectable()
export class UsersService {
  private _usersUrl = 'http://localhost:3000/api/usuarios';

  constructor(private _http: HttpClient) { }

  permiteAccesoLogin(email: string, password: string): Observable<User[]> {
    let url = this._usersUrl + '?email=' + email;
    
    return this._http.get<User[]>(url, { 
                        headers: new HttpHeaders().set('Access-Control-Allow-Origin', '*'),
                    })
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
