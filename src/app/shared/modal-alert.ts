import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';

import { ModalAlert as ModalAlertData } from './modal';

@Component({
  selector: 'app-modal-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="space-y-4">
      <h1 class="text-lg font-semibold text-slate-950">{{ data.title }}</h1>
      <p class="text-sm text-slate-700">{{ data.message }}</p>
      <div class="flex justify-end gap-2">
        <button class="ui-button ui-button-primary" (click)="close()">
          {{ data.buttonLabel }}
        </button>
      </div>
    </section>
  `,
})
export class ModalAlert {
  protected readonly dialogRef = inject(DialogRef<void>);
  protected readonly data = inject<ModalAlertData>(DIALOG_DATA);

  close() {
    this.dialogRef.close();
  }
}
