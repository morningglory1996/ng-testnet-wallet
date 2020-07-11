import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-send-dialog',
  templateUrl: './send-dialog.component.html',
  styleUrls: ['./send-dialog.component.scss']
})
export class SendDialogComponent implements OnInit {
  sendingForm: FormGroup;
  amount = new FormControl('',[Validators.required, Validators.min(1)]);
  recipient = new FormControl('',[Validators.required]);
  fee = new FormControl('',[Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    public dialogRef: MatDialogRef<SendDialogComponent>,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sendingForm = new FormGroup({
      amount: this.amount,
      recipient: this.recipient,
      fee: this.fee
    })
  }

  recipientErrorMessage() {
    return this.recipient.hasError('required') ? '宛先を入力してください' : '';
  }

  amountErrorMessage() {
    if(this.amount.hasError('required')) {
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
      data: sendingForm.value
    });
  }
}
