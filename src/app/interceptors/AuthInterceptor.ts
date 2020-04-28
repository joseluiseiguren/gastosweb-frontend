import { UrlConstants } from 'src/app/constants/url.constants';
import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/internal/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private _userService: UsersService,
              private _router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (localStorage.getItem('alow') !== null) {
      const changedReq = req.clone({ headers: req.headers.set('x-access-token', localStorage.getItem('alow')) });
      return next.handle(changedReq).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // do stuff
          // console.log(event);
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // not logged in so redirect to login page
            this._userService.logout();
            this._router.navigate(['/' + UrlConstants.LOGIN]);
          }
        }
      }));
    }

    return next.handle(req);
  }
}
