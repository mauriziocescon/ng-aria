import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';

import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';

import isEmpty from 'lodash/isEmpty';

import { TranslocoPipe } from '@jsverse/transloco';

import { Icon } from './icon';

@Component({
  selector: 'app-text-filter',
  imports: [
    FormsModule,
    TranslocoPipe,
    Icon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="block rounded-lg border border-white/70 bg-white/80 p-4 shadow-sm ring-1 ring-slate-950/5 backdrop-blur">
      <span class="ui-label">{{ 'TEXT_FILTER.PLACEHOLDER' | transloco }}</span>
      <span class="relative block">
        <input
          class="ui-input pr-11"
          type="text"
          [(ngModel)]="value">
      @if (isNotEmpty()) {
        <button
          type="button"
          class="ui-icon-button absolute right-1 top-1/2 -translate-y-1/2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Clear"
          (click)="resetTextFilter()">
          <app-icon name="close" />
        </button>
      }
      </span>
    </label>
  `,
})
export class TextFilter {
  protected readonly value = signal('');
  protected readonly isNotEmpty = computed(() => !isEmpty(this.value()));

  protected readonly value$ = toObservable(this.value).pipe(debounceTime(500), distinctUntilChanged(), skip(1));
  readonly valueDidChange = outputFromObservable(this.value$);

  resetTextFilter() {
    this.value.set('');
  }
}
