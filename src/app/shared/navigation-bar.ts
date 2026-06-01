import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { TranslocoPipe } from '@jsverse/transloco';
import { Menu, MenuItem, MenuTrigger } from '@angular/aria/menu';

import { AppConstants } from '../core/app-constants';
import { AppLanguage } from '../core/app-language';

import { Icon } from './icon';

@Component({
  selector: 'app-navigation-bar',
  imports: [
    TranslocoPipe,
    Menu,
    MenuItem,
    MenuTrigger,
    Icon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="flex h-14 items-center gap-3 bg-brand px-4 text-white">
      <span class="font-semibold">{{ "NAVIGATION_BAR.NAME" | transloco }}</span>
      <button class="ui-button text-white hover:bg-white/10" aria-label="go to instances" (click)="goToInstanceList()">
        {{ "NAVIGATION_BAR.INSTANCES" | transloco }}
      </button>

      <span class="flex-1"></span>

      @if (canOpenJsonServer()) {
        <button class="ui-icon-button text-white hover:bg-white/10" aria-label="open json server"
                (click)="openJsonServer()">
          <app-icon name="dns" />
        </button>
      }

      <div class="relative">
        <button class="ui-button text-white hover:bg-white/10" ngMenuTrigger [menu]="menu"
                aria-label="selected language">
          {{ selectedLanguageId() }}
          <app-icon name="chevron-down" />
        </button>
        <div
          ngMenu
          #menu="ngMenu"
          class="absolute right-0 top-12 z-50 min-w-32 rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-lg data-[visible=false]:hidden">
          @for (language of languages(); track language) {
            <button
              ngMenuItem
              [value]="language"
              class="block w-full rounded px-3 py-2 text-left text-sm hover:bg-slate-100 data-[active=true]:bg-slate-100"
              (click)="selectLanguage(language)">
              <span>{{ language }}</span>
            </button>
          }
        </div>
      </div>
    </header>
  `,
})
export class NavigationBar {
  private readonly router = inject(Router);
  private readonly appConstants = inject(AppConstants);
  private readonly appLanguage = inject(AppLanguage);

  protected readonly languages = signal(this.appLanguage.getSupportedLanguagesList());
  protected readonly selectedLanguageId = signal<string>(this.appLanguage.getLanguageId());

  protected readonly canOpenJsonServer = computed(() => this.appConstants.Application.SHOW_JSON_SERVER_API === true);

  selectLanguage(language: string) {
    this.appLanguage.setLanguageId(language);
  }

  goToInstanceList() {
    this.router.navigateByUrl('/instance-list');
  }

  openJsonServer() {
    window.open(this.appConstants.Application.JSON_SERVER_API_URL);
  }
}
