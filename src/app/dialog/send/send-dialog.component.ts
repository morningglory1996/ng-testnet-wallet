import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ScanDialogComponent } from '../scan-dialog/scan-dialog.component';
import { DialogService } from '../shared/dialog.service';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.scss'],
})
export class SendDialogComponent implements OnInit, OnDestroy {
  sendingForm: FormGroup;
  amount = new FormControl('', [Validators.required, Validators.min(1)]);
  recipient = new FormControl('', [Validators.required]);
  fee = new FormControl('', [Validators.required]);
  convertJPY: number = 0;
  inputAddress: string;
  inputAmount: number = 0;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SendDialogComponent>,
    private dialog: MatDialog,
    private _dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.sendingForm = new FormGroup({
      amount: this.amount,
      recipient: this.recipient,
      fee: this.fee,
    });

    this._dialogService.scanStart();
  }

  ngOnDestroy() {
    this._dialogService.scanEnd();
  }

  recipientErrorMessage() {
    return this.recipient.hasError('required') ? '宛先を入力してください' : '';
  }

  amountErrorMessage() {
    if (this.amount.hasError('required')) {
      return '送金額を入力してください';
    }
    return this.amount.hasError('min') ? '送金額は1satoshi以上で入力してください' : '';
  }

  feeErrorMessage() {
    return this.fee.hasError('required') ? '手数料を入力してください' : '';
  }

  close(): void {
    this.dialogRef.close();
  }

  openConfirm(sendingForm) {
    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: sendingForm.value,
      disableClose: true,
    });
  }

  openScanDialog() {
    const dialogRef = this.dialog.open(ScanDialogComponent, {});
    this._dialogService.scanSuccess.subscribe((data) => {

      if(data.indexOf('bitcoin') != -1) {
        const splitData = data.split('?')[0];
        const splitAmountBTC = data.split('=')[1];
        const splitAddress = splitData.split(':')[1];
        const amountSatoshi = Number(splitAmountBTC) * 1e8;
        this.inputAddress = splitAddress;
        this.inputAmount = amountSatoshi;
      } else {
        this.inputAddress = data;
      }

      dialogRef.close();
    });
  }
}
