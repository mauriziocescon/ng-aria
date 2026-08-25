import { Component, computed, effect, inject, input, untracked } from '@angular/core';
import { Location } from '@angular/common';

import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

import { Icon } from '../../../shared/icon';
import { ModalManager } from '../../../shared/modal-manager';
import { ModalAlert } from '../../../shared/modal';

import { InstanceDetailStore } from '../../store/instance-detail-store';

@Component({
  selector: 'app-next-step',
  imports: [
    TranslocoPipe,
    Icon,
  ],
  template: `
    <div class="sticky top-20">
      <section class="ui-card border-brand/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,246,255,0.9))] dark:border-slate-700/70 dark:bg-[linear-gradient(180deg,rgba(30,41,59,0.96),rgba(15,23,42,0.9))]">
        <header class="ui-card-header border-b border-slate-100 pb-3 dark:border-slate-700">{{ "NEXT_STEP.HEADER" | transloco }}</header>
        <footer class="ui-card-actions justify-start">
          <div class="flex w-full flex-col gap-3">
            <button
              class="ui-button ui-button-primary w-full"
              (click)="moveToNextStep()"
              [disabled]="!instanceDetailStore.isNextStepEnable()">
              {{ "NEXT_STEP.NEXT_STEP" | transloco }}
            </button>

            @if (isSynchronized()) {
              <div class="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-success ring-1 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40">
                <app-icon name="done" />
                <span>{{ "NEXT_STEP.SYNC" | transloco }}</span>
              </div>
            } @else if (instanceDetailStore.isSyncingBlocks()) {
            <div class="flex items-center gap-2 rounded-md bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-100 dark:bg-slate-900/50 dark:text-slate-400 dark:ring-slate-700">
              <app-icon name="sync" />
              <span>{{ "NEXT_STEP.SYNCING" | transloco }}</span>
            </div>
          } @else if (canRetrySync()) {
            <button class="ui-button ui-button-secondary w-full" (click)="retrySynchronization()">
              <app-icon name="redo" />
              <span>{{ "NEXT_STEP.RETRY" | transloco }}</span>
            </button>
          }
          </div>
        </footer>
      </section>
    </div>
  `,
})
export class NextStep {
  private readonly location = inject(Location);
  private readonly transloco = inject(TranslocoService);
  private readonly modalManager = inject(ModalManager);
  protected readonly instanceDetailStore = inject(InstanceDetailStore);

  readonly instanceId = input.required<string>();

  protected readonly isSynchronized = computed(() => {
    return !this.instanceDetailStore.isSyncingBlocks() &&
      this.instanceDetailStore.syncingError() === undefined;
  });
  protected readonly canRetrySync = computed(() => {
    return !this.instanceDetailStore.isSyncingBlocks() &&
      this.instanceDetailStore.syncingError() !== undefined;
  });

  private readonly syncErrorWatcher = effect(() => {
    this.instanceDetailStore.syncingError();
    untracked(() => this.showModalError());
  });

  moveToNextStep() {
    this.location.back();
  }

  retrySynchronization() {
    this.instanceDetailStore.syncBlocks({ instanceId: this.instanceId() });
  }

  private showModalError() {
    if (this.instanceDetailStore.syncingError()) {
      const modalAlert: ModalAlert = {
        id: 'blockListError',
        title: this.transloco.translate('BLOCK_LIST.ALERT_TITLE'),
        message: this.instanceDetailStore.syncingError() as string,
        buttonLabel: this.transloco.translate('BLOCK_LIST.ALERT_BUTTON'),
      };
      this.modalManager.alert(modalAlert);
    }
  }
}
