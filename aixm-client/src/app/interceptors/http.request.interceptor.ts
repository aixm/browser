import { Injectable, InjectionToken, inject }                   from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, timeout }                                  from 'rxjs';
import { AuthService }                                          from '../services/auth.service';

export const DEFAULT_TIMEOUT: InjectionToken<number> = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  protected defaultTimeout = inject(DEFAULT_TIMEOUT);
  authService = inject(AuthService);


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token: string = this.authService.token;

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    request.headers.set('Content-Type', 'application/json');
    request.headers.set('Accept', 'application/json');

    const timeoutValue: number = Number(request.headers.get('timeout') || this.defaultTimeout);

    // return next.handle(request);
    return next.handle(request).pipe(timeout(timeoutValue));
  }
}
