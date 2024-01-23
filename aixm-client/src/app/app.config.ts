import { HTTP_INTERCEPTORS, HttpClientModule }    from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter }                          from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations }                       from '@angular/platform-browser/animations';
import { DEFAULT_TIMEOUT, HttpRequestInterceptor } from './interceptors/http.request.interceptor';

export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
      // default timeout 2min other can be specified in header in ms like:
      // { headers: new HttpHeaders({ timeout: `${20000}` }) }
    { provide: DEFAULT_TIMEOUT, useValue: 120000 },
  ]
};
