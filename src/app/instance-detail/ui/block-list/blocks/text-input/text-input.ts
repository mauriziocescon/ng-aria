import { ChangeDetectionStrategy, Component, computed, inject, input, linkedSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslocoPipe } from '@jsverse/transloco';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import { Icon } from '../../../../../shared/icon';
import { ValidityState } from '../../../../../shared/validity-state';

import { InstanceDetailStore } from '../../../../store/instance-detail-store';

import { TextInputBlock } from './text-input-block';

@Component({
  selector: 'app-text-input',
  imports: [
    FormsModule,
    TranslocoPipe,
    Icon,
    ValidityState,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ui-card">
      <header class="ui-card-header">{{ "TEXT_INPUT.HEADER" | transloco }}</header>
      <div class="ui-card-content">
        <label class="block">
          <span class="ui-label">{{ label() | transloco }}</span>
          <span class="relative block">
          <input
            class="ui-input pr-10"
            type="text"
            [(ngModel)]="value"
            (ngModelChange)="valueDidChange()"
            [disabled]="disabled()"
            [required]="required()"
            [placeholder]="'TEXT_INPUT.TEXT_INPUT_PLACEHOLDER' | transloco" />
            @if (isNotEmpty()) {
              <button
                type="button"
                class="ui-icon-button absolute right-0 top-1/2 -translate-y-1/2"
                aria-label="Clear"
                (click)="resetTextInput()">
              <app-icon name="close" />
            </button>
            }
          </span>
          @if (showHint()) {
            <span class="ui-hint">{{ message() | transloco: hintParams() }}</span>
          }
        </label>
      </div>
      <footer class="ui-card-actions">
        <span appValidityState [valid]="valid()"></span>
      </footer>
    </section>
  `,
})
export class TextInput {
  private readonly instanceDetailStore = inject(InstanceDetailStore);

  readonly instanceId = input.required<string>();
  readonly block = input.required<TextInputBlock>();

  protected readonly value = linkedSignal(() => this.block().value ?? null);
  protected readonly disabled = computed(() => this.block().disabled);
  protected readonly required = computed(() => this.block().required);
  protected readonly label = computed(() => this.block().label);
  protected readonly valid = computed(() => this.block().valid);

  protected readonly isNotEmpty = computed(() => !isEmpty(this.block().value));
  protected readonly showHint = computed(() => {
    const minLength = this.block().minLength ?? -1;
    const maxLength = this.block().maxLength ?? -1;
    return minLength >= 0 && maxLength >= 0;
  });
  protected readonly message = computed(() => {
    const minLength = this.block().minLength ?? -1;
    const maxLength = this.block().maxLength ?? -1;

    if (minLength >= 0 && maxLength >= 0) {
      return `TEXT_INPUT.TEXT_INPUT_MSG_MIN_MAX_LENGTH`;
    } else if (minLength >= 0) {
      return `TEXT_INPUT.TEXT_INPUT_MSG_MIN_LENGTH`;
    } else if (maxLength >= 0) {
      return `TEXT_INPUT.TEXT_INPUT_MSG_MAX_LENGTH`;
    } else {
      return ``;
    }
  });
  protected readonly hintParams = computed(() => {
    const minLength = this.block().minLength ?? -1;
    const maxLength = this.block().maxLength ?? -1;
    return { minLength, maxLength };
  }, { equal: isEqual });

  resetTextInput() {
    this.value.set(null);
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
