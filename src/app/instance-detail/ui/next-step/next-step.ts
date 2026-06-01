import { ChangeDetectionStrategy, Component, computed, effect, inject, input, untracked } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sticky top-0">
      <section class="ui-card">
        <header class="ui-card-header">{{ "NEXT_STEP.HEADER" | transloco }}</header>
        <footer class="ui-card-actions justify-start">
          <div class="flex flex-col gap-3">
            <button
              class="ui-button ui-button-primary"
              (click)="moveToNextStep()"
              [disabled]="!instanceDetailStore.isNextStepEnable()">
              {{ "NEXT_STEP.NEXT_STEP" | transloco }}
            </button>

            @if (isSynchronized()) {
              <div class="flex items-center gap-2 text-sm text-success">
                <app-icon name="done" />
                <span>{{ "NEXT_STEP.SYNC" | transloco }}</span>
              </div>
            } @else if (instanceDetailStore.isSyncingBlocks()) {
            <div class="flex items-center gap-2 text-sm text-slate-600">
              <app-icon name="sync" />
              <span>{{ "NEXT_STEP.SYNCING" | transloco }}</span>
            </div>
          } @else if (canRetrySync()) {
            <button class="ui-button ui-button-secondary" (click)="retrySynchronization()">
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
