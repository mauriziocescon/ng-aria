import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

import { ModalConfirmer as ModalConfirmerData } from './modal';

@Component({
  selector: 'app-modal-confirmer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-4">
      <h1 class="text-lg font-semibold text-slate-950">{{ data.title }}</h1>
      <p class="text-sm text-slate-700">{{ data.message }}</p>
      <div class="flex justify-end gap-2">
        <button class="ui-button ui-button-primary" (click)="yes()">
          {{ data.yesButtonLabel }}
        </button>
        <button class="ui-button ui-button-secondary" (click)="no()">
          {{ data.noButtonLabel }}
        </button>
      </div>
    </section>
  `,
})
export class ModalConfirmer {
  protected readonly dialogRef = inject(DialogRef<boolean>);
  protected readonly data = inject<ModalConfirmerData>(DIALOG_DATA);

  yes() {
    this.dialogRef.close(true);
  }

  no() {
    this.dialogRef.close(false);
  }
}
