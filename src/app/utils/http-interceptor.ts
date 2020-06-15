import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {

    const idToken = localStorage.getItem('id_token');
    req.headers.set('Access-Control-Allow-Origin', '*');
    console.log('INSIDE interceptor');
    if (idToken) {
      console.log('set TOKEN:::::::: ' + idToken);
      const cloned = req.clone({
        headers: req.headers.set('token', idToken)
      });

      return next.handle(cloned);
    }
    else {
      return next.handle(req);
    }
  }
}
