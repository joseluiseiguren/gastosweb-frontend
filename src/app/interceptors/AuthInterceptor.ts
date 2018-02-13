import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (localStorage.getItem('alow') !== null) {
      const changedReq = req.clone({ headers: req.headers.set('x-access-token', localStorage.getItem('alow')) });
      return next.handle(changedReq);
    }

    return next.handle(req);
    
  }
}