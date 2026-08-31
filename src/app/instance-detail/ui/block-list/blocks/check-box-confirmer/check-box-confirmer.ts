import { Component, computed, inject, input, linkedSignal } from '@angular/core';
import { disabled, form, FormField, required } from '@angular/forms/signals';

import { Subscription } from 'rxjs';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { ValidityState } from '../../../../../shared/validity-state';
import { ModalManager } from '../../../../../shared/modal-manager';

import { InstanceDetailStore } from '../../../../store/instance-detail-store';

import { CheckBoxConfirmerBlock } from './check-box-confirmer-block';

@Component({
  selector: 'app-check-box-confirmer',
  imports: [
    FormField,
    TranslocoPipe,
    ValidityState,
  ],
  template: `
    <section class="ui-card">
      <header class="ui-card-header">{{ "CHECK_BOX_CONFIRMER.HEADER" | transloco }}</header>
      <div class="ui-card-content space-y-2">
        <div class="ui-label">{{ label() | transloco }}</div>
        <label class="flex items-start gap-3">
          <input
            class="mt-1 size-4 rounded border-slate-300 text-brand focus:ring-brand dark:border-slate-600 dark:bg-slate-900 dark:text-brand-light dark:focus:ring-brand-light"
            type="checkbox"
            [formField]="checkBoxConfirmerForm.value" />
          <span>{{ description() | transloco }}</span>
        </label>
      </div>
      <footer class="ui-card-actions">
        <span appValidityState [valid]="valid()"></span>
      </footer>
    </section>
  `,
})
export class CheckBoxConfirmer {
  private readonly transloco = inject(TranslocoService);
  private readonly modalManager = inject(ModalManager);
  private readonly instanceDetailStore = inject(InstanceDetailStore);

  readonly instanceId = input.required<string>();
  readonly block = input.required<CheckBoxConfirmerBlock>();

  protected readonly label = computed(() => this.block().label);
  protected readonly description = computed(() => this.block().description);
  protected readonly checkBoxConfirmer = linkedSignal(() => ({
    value: this.block().value ?? false,
  }), {
    set: (newModel) => {
      if (newModel.value) {
        this.askForConfirmation();
      } else {
        this.instanceDetailStore.updateBlock({
          instanceId: this.instanceId(),
          blockId: this.block().id,
          value: newModel.value,
        });
      }
    },
  });

  protected readonly checkBoxConfirmerForm = form(this.checkBoxConfirmer, (schema) => {
    required(schema.value, { when: () => this.block().required });
    disabled(schema.value, { when: () => this.block().disabled });
  });

  protected readonly valid = computed(() => this.block().valid && this.checkBoxConfirmerForm.value().valid());

  private modalSubscription: Subscription | undefined = undefined;

  private askForConfirmation() {
    this.modalSubscription?.unsubscribe();

    this.modalSubscription = this.modalManager.confirmer({
      id: 'checkBoxConfirmer',
      title: this.transloco.translate('CHECK_BOX_CONFIRMER.CONFIRMATION_TITLE'),
      message: this.transloco.translate('CHECK_BOX_CONFIRMER.CONFIRMATION_MESSAGE'),
      yesButtonLabel: this.transloco.translate('CHECK_BOX_CONFIRMER.CONFIRMATION_YES_BUTTON'),
      noButtonLabel: this.transloco.translate('CHECK_BOX_CONFIRMER.CONFIRMATION_NO_BUTTON'),
    })
      .subscribe(result => {
        if (result === true) {
          this.instanceDetailStore.updateBlock({
            instanceId: this.instanceId(),
            blockId: this.block().id,
            value: true,
          });
        } else {
          this.checkBoxConfirmerForm.value().value.set(false);
        }
      });
  }
}
