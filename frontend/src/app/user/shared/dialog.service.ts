import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

import { UserInviteComponent } from '../user-invite/user-invite.component';
import { ConfirmDialogData } from './confirm-dialog-data';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  confirmDialog(data: ConfirmDialogData) {
    return this.dialog
      .open(ConfirmDialogComponent, {
        data,
        width: '400px',
        disableClose: true,
      }); 
  }

  confirmUpdate(data:ConfirmDialogData){
    return this.dialog
      .open(ConfirmDialogComponent, {
        data,
        width: '390px',
        panelClass:'confirm-dialog-container',
        position:{top:"10px"},
        disableClose: true,
      }); 
  }
}
