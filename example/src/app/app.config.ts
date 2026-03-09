import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor, provideXpmAuth } from 'headless-xpm-angular';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideXpmAuth({
      baseUrl:environment.openApiUrl,
      clientId: environment.clientId,
      issuer: environment.issuer,
      redirectUri: environment.redirectUri || window.location.origin,
    }),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
