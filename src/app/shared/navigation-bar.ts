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
    <header class="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-white/15 bg-[linear-gradient(135deg,#00346f,#004494_48%,#0f766e)] px-4 text-white shadow-lg shadow-slate-950/15 backdrop-blur">
      <span class="rounded-md bg-white/10 px-3 py-1.5 text-sm font-bold tracking-wide ring-1 ring-white/15">
        {{ "NAVIGATION_BAR.NAME" | transloco }}
      </span>
      <button class="ui-button bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/20" aria-label="go to instances" (click)="goToInstanceList()">
        {{ "NAVIGATION_BAR.INSTANCES" | transloco }}
      </button>

      <span class="flex-1"></span>

      @if (canOpenJsonServer()) {
        <button class="ui-icon-button bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/20" aria-label="open json server"
                (click)="openJsonServer()">
          <app-icon name="dns" />
        </button>
      }

      <div class="relative">
        <button class="ui-button bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/20" ngMenuTrigger [menu]="menu"
                aria-label="selected language">
          {{ selectedLanguageId() }}
          <app-icon name="chevron-down" />
        </button>
        <div
          ngMenu
          #menu="ngMenu"
          class="absolute right-0 top-12 z-50 min-w-32 rounded-lg border border-white/70 bg-white/95 p-1.5 text-slate-950 shadow-xl ring-1 ring-slate-950/10 backdrop-blur data-[visible=false]:hidden">
          @for (language of languages(); track language) {
            <button
              ngMenuItem
              [value]="language"
              class="block w-full rounded-md px-3 py-2 text-left text-sm font-medium hover:bg-sky-50 data-[active=true]:bg-sky-50 data-[active=true]:text-brand"
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
