import {
  ApplicationConfig,
  provideAppInitializer,
  provideZonelessChangeDetection,
  inject
} from '@angular/core';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { NavigationService } from './cms/services/navigation.service';
import { authInterceptor, provideXpmAuth } from 'headless-xpm-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideXpmAuth({
      baseUrl: "https://sites.tridiondemo.com/api/v3.0",
      clientId: "7c236b33-86cf-41eb-8b78-b119025a9f8c",
      issuer:"https://access.tridiondemo.com/access-management/connect",
      redirectUri:"http://localhost:4200"
    }),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideRouter(routes, withComponentInputBinding()),
    provideAppInitializer(async () => {
      const navigationService = inject(NavigationService);
      try {
        await navigationService.loadNavigation();
      } catch (e) {
        console.warn('CMS routes initialization bypassed on error:', e);
      }
    }),
  ],
};