import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable }                                                         from '@angular/core';
import { MatSnackBar }                                                        from '@angular/material/snack-bar';
import { Router }                               from '@angular/router';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { AuthService }                          from '../services/auth.service';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return new Observable((observer: Subscriber<HttpEvent<any>>) => {
      const subscription: Subscription = next.handle(req)
        .subscribe(
            (event: HttpEvent<any>): void => {
            if (event instanceof HttpResponse) {
              // no errors => continue
            }
            observer.next(event);
          },
          err => {
            // console.log('error', err);
            if (err.status === 401) {
              // auto logout if 401 response returned from api
              if (this.authService.User) {
                this.authService.resetCredentials();
              }
              observer.error(err);
              this.authService.showLogin();
            } else if (err.status === 0) {
              this.snackBar.open(`Connecting...`, 'Ok', {duration: 5000});
            } else {
              observer.error(err);
            }
          },
          (): void => {
            observer.complete();
          },
        );
      // finally complete request and unsubscribe
      return (): void => {
        subscription.unsubscribe();
      };
    });
  }
}
