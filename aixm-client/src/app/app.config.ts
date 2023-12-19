import { HttpClientModule }                       from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS }       from '@angular/material/bottom-sheet';
import { provideRouter }                          from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
  ]
};
