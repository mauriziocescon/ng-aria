import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { disabled, form, FormField, required } from '@angular/forms/signals';

import { TranslocoPipe } from '@jsverse/transloco';

import { ValidityState } from '../../../../../shared/validity-state';

import { InstanceDetailStore } from '../../../../store/instance-detail-store';

import { CheckBoxBlock } from './check-box-block';

@Component({
  selector: 'app-check-box',
  imports: [
    FormField,
    TranslocoPipe,
    ValidityState,
  ],
  template: `
    <section class="ui-card">
      <header class="ui-card-header">{{ "CHECK_BOX.HEADER" | transloco }}</header>
      <div class="ui-card-content space-y-2">
        <div class="ui-label">{{ label() | transloco }}</div>
        <label class="flex items-start gap-3">
          <input
            class="mt-1 size-4 rounded border-slate-300 text-brand focus:ring-brand dark:border-slate-600 dark:bg-slate-900 dark:text-brand-light dark:focus:ring-brand-light"
            type="checkbox"
            [formField]="checkBoxForm.value" />
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

  protected readonly label = computed(() => this.block().label);
  protected readonly description = computed(() => this.block().description);
  protected readonly checkBox = linkedSignal(() => ({
    value: this.block().value ?? false,
  }), {
    set: (newModel) => {
      this.instanceDetailStore.updateBlock({
        instanceId: this.instanceId(),
        blockId: this.block().id,
        value: newModel.value,
      });
    },
  });

  protected readonly checkBoxForm = form(this.checkBox, (schema) => {
    required(schema.value, { when: () => this.block().required });
    disabled(schema.value, { when: () => this.block().disabled });
  });

  protected readonly valid = computed(() => this.block().valid && this.checkBoxForm.value().valid());
}
