import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoPipe } from '@jsverse/transloco';

import { ValidityState } from '../../../../../shared/validity-state';

import { InstanceDetailStore } from '../../../../store/instance-detail-store';

import { CheckBoxBlock } from './check-box-block';

@Component({
  selector: 'app-check-box',
  imports: [
    FormsModule,
    TranslocoPipe,
    ValidityState,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ui-card">
      <header class="ui-card-header">{{ "CHECK_BOX.HEADER" | transloco }}</header>
      <div class="ui-card-content space-y-2">
        <div class="ui-label">{{ label() | transloco }}</div>
        <label class="flex items-start gap-3">
          <input
            class="mt-1 size-4 rounded border-slate-300 text-brand focus:ring-brand"
            type="checkbox"
            [(ngModel)]="value"
            (ngModelChange)="valueDidChange()"
            [disabled]="disabled()"
            [required]="required()" />
          <span>{{ description() | transloco }}</span>
        </label>
      </div>
      <footer class="ui-card-actions">
        <span appValidityState [valid]="valid()"></span>
      </footer>
    </section>
  `,
})
export class CheckBox {
  private readonly instanceDetailStore = inject(InstanceDetailStore);

  readonly instanceId = input.required<string>();
  readonly block = input.required<CheckBoxBlock>();

  protected readonly value = linkedSignal(() => this.block().value ?? false);
  protected readonly disabled = computed(() => this.block().disabled);
  protected readonly required = computed(() => this.block().required);
  protected readonly label = computed(() => this.block().label);
  protected readonly description = computed(() => this.block().description);
  protected readonly valid = computed(() => this.block().valid);

  valueDidChange() {
    this.instanceDetailStore.updateBlock({
      instanceId: this.instanceId(),
      blockId: this.block().id,
      value: this.value(),
    });
  }
}
