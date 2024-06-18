import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig }                       from '@angular/core';
import { provideRouter }                          from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations }                       from '@angular/platform-browser/animations';
import { DEFAULT_TIMEOUT, HttpRequestInterceptor } from './interceptors/http.request.interceptor';
import { HttpResponseInterceptor } from './interceptors/http.response.interceptor';

export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true },
      // default timeout 2min other can be specified in header in ms like:
      // { headers: new HttpHeaders({ timeout: `${20000}` }) }
    { provide: DEFAULT_TIMEOUT, useValue: 120000 },
  ]
};
