import { ApplicationConfig, inject, isDevMode, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
  withExperimentalPlatformNavigation,
} from '@angular/router';

import { provideTransloco } from '@jsverse/transloco';

import { AppLanguage } from './core/app-language';
import { TranslocoHttpLoader } from './core/transloco-loader';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withExperimentalPlatformNavigation(),
      withExperimentalAutoCleanupInjectors(),
    ),
    provideTransloco({
      config: {
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    {
      provide: LOCALE_ID,
      useFactory: () => inject(AppLanguage).getLanguageId(),
    },
  ],
};
