import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoPipe } from '@jsverse/transloco';

import { ValidityState } from '../../../../../shared/validity-state';

import { InstanceDetailStore } from '../../../../store/instance-detail-store';

import { DatePickerBlock } from './date-picker-block';

@Component({
  selector: 'app-date-picker',
  imports: [
    FormsModule,
    TranslocoPipe,
    ValidityState,
  ],
  template: `
    <section class="ui-card">
      <header class="ui-card-header">{{ "DATE_PICKER.HEADER" | transloco }}</header>
      <div class="ui-card-content">
        <label class="block">
          <span class="ui-label">{{ label() | transloco }}</span>
          <input
            class="ui-input"
            type="date"
            [(ngModel)]="value"
            (ngModelChange)="valueDidChange()"
            [disabled]="disabled()"
            [required]="required()"/>
          <span class="ui-hint">YYYY-MM-DD</span>
        </label>
      </div>
      <footer class="ui-card-actions">
        <span appValidityState [valid]="valid()"></span>
      </footer>
    </section>
  `,
})
export class DatePicker {
  private readonly instanceDetailStore = inject(InstanceDetailStore);

  readonly instanceId = input.required<string>();
  readonly block = input.required<DatePickerBlock>();

  protected readonly value = linkedSignal(() => this.toDateInputValue(this.block().value));
  protected readonly disabled = computed(() => this.block().disabled);
  protected readonly required = computed(() => this.block().required);
  protected readonly label = computed(() => this.block().label);
  protected readonly description = computed(() => this.block().description);
  protected readonly valid = computed(() => this.block().valid);

  valueDidChange() {
    this.instanceDetailStore.updateBlock({
      instanceId: this.instanceId(),
      blockId: this.block().id,
      value: this.toIsoDateValue(this.value()),
    });
  }

  private toDateInputValue(value: string | null | undefined) {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toISOString().slice(0, 10);
  }

  private toIsoDateValue(value: string | null) {
    if (!value) {
      return null;
    }

    return new Date(`${value}T00:00:00.000Z`).toISOString();
  }
}
