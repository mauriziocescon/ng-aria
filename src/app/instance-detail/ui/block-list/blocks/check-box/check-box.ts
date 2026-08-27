import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { disabled as formDisabled, form, FormField, required as formRequired } from '@angular/forms/signals';

import { TranslocoPipe } from '@jsverse/transloco';

import { ValidityState } from '../../../../../shared/validity-state';

import { InstanceDetailStore } from '../../../../store/instance-detail-store';

import { CheckBoxBlock } from './check-box-block';

@Component({
  selector: 'app-check-box',
  imports: [
    FormsModule,
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
            [(ngModel)]="value"
            (ngModelChange)="valueDidChange()"
            [disabled]="disabled()"
            [required]="required()" />
          <span>{{ description() | transloco }}</span>
        </label>
        <!-- Signal Form equivalent -->
        <label class="flex items-start gap-3">
          <input
            class="mt-1 size-4 rounded border-slate-300 text-brand focus:ring-brand dark:border-slate-600 dark:bg-slate-900 dark:text-brand-light dark:focus:ring-brand-light"
            type="checkbox"
            [formField]="checkBoxForm.value" />
          <span>{{ description() | transloco }}</span>
        </label>
      </div>
      <footer class="ui-card-actions">
        <span appValidityState [valid]="checkBoxForm.value().valid()"></span>
        <span appValidityState [valid]="valid()"></span>
      </footer>
    </section>
  `,
})
export class CheckBox {
  private readonly instanceDetailStore = inject(InstanceDetailStore);

  readonly instanceId = input.required<string>();
  readonly block = input.required<CheckBoxBlock>();

  // --- NgModel-based approach ---
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

  // --- Signal Form equivalent ---
  protected readonly checkBoxModel = linkedSignal(() => ({
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

  protected readonly checkBoxForm = form(this.checkBoxModel, (schema) => {
    formRequired(schema.value, { when: () => this.block().required });
    formDisabled(schema.value, { when: () => this.block().disabled });
  });
}
