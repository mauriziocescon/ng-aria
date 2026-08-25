import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

import { TranslocoPipe } from '@jsverse/transloco';

import { ValidityState } from '../../shared/validity-state';

import { Instance } from '../model/instance';

@Component({
  selector: 'app-instance-card',
  imports: [
    TranslocoPipe,
    ValidityState,
  ],
  template: `
    <section class="ui-card group flex h-full flex-col">
      <header class="ui-card-header">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 truncate text-lg">{{ title() }}</div>
          <span class="rounded-md bg-sky-50 px-2 py-1 text-xs font-semibold text-brand ring-1 ring-sky-100 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-800/50">
            {{ blocksCounter() }}
          </span>
        </div>
        <div class="mt-3 flex items-center text-sm font-normal text-slate-500 dark:text-slate-400">
          <span appValidityState [valid]="validityState()"></span>
        </div>
      </header>
      <div class="ui-card-content line-clamp-3 flex-1">{{ bodyText() }}</div>
      <footer class="ui-card-actions">
        <button class="ui-button ui-button-primary w-full sm:w-auto" (click)="selectInstance()">
          {{ "INSTANCE.SHOW" | transloco }}
        </button>
      </footer>
    </section>
  `,
})
export class InstanceCard {
  private readonly router = inject(Router);

  readonly instance = input.required<Instance>();

  protected readonly title = computed(() => this.instance()?.id);
  protected readonly bodyText = computed(() => this.instance()?.description);
  protected readonly validityState = computed(() => this.instance()?.blocks.every(i => i.valid === true));
  protected readonly blocksCounter = computed(() => {
    const validBlocks = this.instance()?.blocks.filter(b => b.valid === true).length;
    return `(${validBlocks} / ${this.instance()?.blocks.length})`;
  });

  selectInstance() {
    this.router.navigateByUrl(`/instance-detail/${this.instance().id}`);
  }
}
