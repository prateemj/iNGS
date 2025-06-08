import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { MsalModule, MSAL_INSTANCE, MsalService, MsalGuard } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './auth.config';

import { importProvidersFrom } from '@angular/core';

export function MSALInstanceFactory() {
  return new PublicClientApplication(msalConfig);
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    importProvidersFrom(MsalModule),
    MsalService,
    MsalGuard,
  ]
};
