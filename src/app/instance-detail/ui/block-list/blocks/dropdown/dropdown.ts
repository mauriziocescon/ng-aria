import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoPipe } from '@jsverse/transloco';
import { Listbox, Option } from '@angular/aria/listbox';

import isEqual from 'lodash/isEqual';

import { ValidityState } from '../../../../../shared/validity-state';

import { InstanceDetailStore } from '../../../../store/instance-detail-store';

import { DropdownBlock } from './dropdown-block';

@Component({
  selector: 'app-dropdown',
  imports: [
    FormsModule,
    TranslocoPipe,
    Listbox,
    Option,
    ValidityState,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ui-card">
      <header class="ui-card-header">{{ "DROPDOWN.HEADER" | transloco }}</header>
      <div class="ui-card-content">
        <div class="space-y-1">
          <span class="ui-label">{{ label() | transloco }}</span>
          <ul
            ngListbox
            class="max-h-56 rounded-md border border-slate-300 bg-white p-1"
            [disabled]="disabled()"
            [values]="value() === null ? [] : [value()]"
            (valuesChange)="selectDropdownValue($event)">
            @for (choice of choices(); track choice) {
              <li
                ngOption
                [value]="choice"
                [label]="choice"
                class="cursor-pointer rounded px-3 py-2 text-sm outline-none hover:bg-slate-100 data-[active=true]:bg-slate-100 aria-selected:bg-brand aria-selected:text-white">
                {{ choice }}
              </li>
            }
          </ul>
        </div>
      </div>
      <footer class="ui-card-actions">
        <span appValidityState [valid]="valid()"></span>
      </footer>
    </section>
  `,
})
export class Dropdown {
  private readonly instanceDetailStore = inject(InstanceDetailStore);

  readonly instanceId = input.required<string>();
  readonly block = input.required<DropdownBlock>();

  protected readonly value = linkedSignal(() => this.block().value ?? null);
  protected readonly disabled = computed(() => this.block().disabled);
  protected readonly required = computed(() => this.block().required);
  protected readonly label = computed(() => this.block().label);
  protected readonly choices = computed(() => this.block().choices, { equal: isEqual });
  protected readonly valid = computed(() => this.block().valid);

  selectDropdownValue(values: (string | null)[]) {
    this.value.set(values[0] ?? null);
    this.valueDidChange();
  }

  valueDidChange() {
    this.instanceDetailStore.updateBlock({
      instanceId: this.instanceId(),
      blockId: this.block().id,
      value: this.value(),
    });
  }
}
