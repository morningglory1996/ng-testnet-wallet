import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WalletService } from '../../wallet/wallet.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  confirmMsg: boolean = true;
  spinner: boolean = false;
  sendingMsg: boolean = false;
  errorMsg: boolean;
  txId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private walletService: WalletService
  ) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }

  spinnerShow() {
    this.spinner = true;
    this.sendingMsg = false;
    this.confirmMsg = false;
    this.errorMsg = false;
  }

  sendingMsgShow() {
    this.sendingMsg = true;
    this.confirmMsg = false;
    this.spinner = false;
    this.errorMsg = false;
  }

  errorMsgShow() {
    this.errorMsg = true;
    this.sendingMsg = false;
    this.confirmMsg = false;
    this.spinner = false;
  }

  sendTx() {
    this.walletService.pushTransaction(this.data).subscribe(
      (result) => {
        this.sendingMsgShow();
        this.txId = result.tx.hash;
      },
      (err) => {
        this.errorMsgShow();
        console.log(err);
      }
    );
  }
}
