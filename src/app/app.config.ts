/**
 * Application configuration object for the Angular app.
 *
 * @remarks
 * - `provideAnimationsAsync` is **deprecated**.
 * - Use `provideAnimations()` from `@angular/platform-browser/animations` instead.
 *
 * @see {@link https://angular.io/api/platform-browser/animations/provideAnimations}
 */
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
  ]
};
