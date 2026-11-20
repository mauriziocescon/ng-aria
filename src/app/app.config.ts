import { ApplicationConfig, inject, isDevMode, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideRouter,
  withAutoCleanupInjectors,
  withComponentInputBinding,
  withExperimentalPlatformNavigation,
  withRouterResources,
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
      withAutoCleanupInjectors(),
      withComponentInputBinding(),
      withExperimentalPlatformNavigation(),
      withRouterResources(),
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
