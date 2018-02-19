import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { AuthInterceptor } from '../interceptors/AuthInterceptor';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class UsersService {
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private _http: HttpClient) { }

    login(email:string, password:string ) : Observable<boolean> {
        return this._http.post<any>('http://localhost:3000/api/usuarios/login', 
                {email, password})
                .map(user => {
                    // login successful if there's a jwt token in the response
                    if (user && user.token) {
                        // store user details and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('alow', user.token);
                        console.log(this.jwtHelper.decodeToken(user.token));
                        return true;
                    }

                    return false;
                }               
              );
    }

    register( usuario:User ) : Observable<void> {

        let fechanacimiento = usuario.fechanacimiento.getFullYear().toString() +  
                (usuario.fechanacimiento.getMonth()+1).toString().padStart(2, '0') +
                usuario.fechanacimiento.getDate().toString().padStart(2, '0');

        return this._http.post<any>('http://localhost:3000/api/usuarios/registracion', 
                {email: usuario.email,
                 password: usuario.password,
                 nombre: usuario.nombre,
                 fechanacimiento: fechanacimiento,
                 moneda: usuario.moneda});
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('alow');
    }

    isSessionExpired(): boolean {
        let token = localStorage.getItem('alow');
        if (token === null || 
            this.jwtHelper.isTokenExpired(token) === true) {
            return true;
        }

        return false;
    }

    getUserName() : string {
        let token = localStorage.getItem('alow');
        let userName = "";

        if (token !== null) {
            userName = this.jwtHelper.decodeToken(token).user;
        }

        return userName;
    }

    getUserId() : number {
        let token = localStorage.getItem('alow');
        let userId = 0;

        if (token !== null) {
            userId = this.jwtHelper.decodeToken(token).id;
        }

        return userId;
    }

    getMoneda() : string {
        let token = localStorage.getItem('alow');
        let moneda = "";

        if (token !== null) {
            moneda = this.jwtHelper.decodeToken(token).moneda;
        }

        return moneda;
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
