import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { AuthInterceptor } from '../interceptors/AuthInterceptor';

@Injectable()
export class UsersService {
  
  constructor(private _http: HttpClient) { }

  login(email:string, password:string ) {
    return this._http.post<any>('http://localhost:3000/api/usuarios/login', 
                {email, password})
                .map(user => {
                    console.log(user);
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        return true;
                    }

                    return false;
                }
              );
  }

  logout() {
      // remove user from local storage to log user out
      localStorage.removeItem('currentUser');
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
