import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-receive-dialog',
  templateUrl: './receive-dialog.component.html',
  styleUrls: ['./receive-dialog.component.scss'],
})
export class ReceiveDialogComponent implements OnInit {
  qrdata: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ReceiveDialogComponent>
  ) {}

  ngOnInit(): void {
    this.qrdata = this.data;
  }

  close() {
    this.dialogRef.close();
  }

  designation(n: number) {
    this.qrdata = '';
    this.qrdata = 'bitcoin:' + this.data + '?amount=' + (n * 1e-8).toFixed(8);
  }
}
