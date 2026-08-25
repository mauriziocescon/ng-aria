import { inject, Service } from '@angular/core';

import { Dialog } from '@angular/cdk/dialog';

import { first } from 'rxjs/operators';

import { ModalAlert, ModalConfirmer } from './modal';

import { ModalAlert as ModalAlertComp } from './modal-alert';
import { ModalConfirmer as ModalConfirmerComp } from './modal-confirmer';

@Service()
export class ModalManager {
  private readonly dialog = inject(Dialog);

  alert(modalAlert: ModalAlert) {
    const dialogRef = this.dialog.open<void, ModalAlert, ModalAlertComp>(ModalAlertComp, {
      data: {
        id: modalAlert.id,
        title: modalAlert.title,
        message: modalAlert.message,
        buttonLabel: modalAlert.buttonLabel,
      },
      role: 'alertdialog',
      ariaModal: true,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      backdropClass: 'ui-dialog-backdrop',
      panelClass: 'ui-dialog-panel',
    });
    return dialogRef.closed;
  }

  confirmer(modalConfirmer: ModalConfirmer) {
    const dialogRef = this.dialog.open<boolean, ModalConfirmer, ModalConfirmerComp>(ModalConfirmerComp, {
      data: {
        id: modalConfirmer.id,
        title: modalConfirmer.title,
        message: modalConfirmer.message,
        yesButtonLabel: modalConfirmer.yesButtonLabel,
        noButtonLabel: modalConfirmer.noButtonLabel,
      },
      role: 'alertdialog',
      ariaModal: true,
      autoFocus: 'first-tabbable',
      restoreFocus: true,
      backdropClass: 'ui-dialog-backdrop',
      panelClass: 'ui-dialog-panel',
    });
    return dialogRef.closed.pipe(first());
  }
}
