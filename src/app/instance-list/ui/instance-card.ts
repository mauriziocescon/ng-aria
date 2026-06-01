import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ui-card">
      <header class="ui-card-header">
        <div>{{ title() }}</div>
        <div class="mt-1 flex items-center gap-3 text-sm font-normal text-slate-500">
          <span>{{ blocksCounter() }}</span>
          <span appValidityState [valid]="validityState()"></span>
        </div>
      </header>
      <div class="ui-card-content">{{ bodyText() }}</div>
      <footer class="ui-card-actions">
        <button class="ui-button ui-button-primary" (click)="selectInstance()">
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
