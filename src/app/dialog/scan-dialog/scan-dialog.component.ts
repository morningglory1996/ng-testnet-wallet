import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../shared/dialog.service';

@Component({
  selector: 'app-scan-dialog',
  templateUrl: './scan-dialog.component.html',
  styleUrls: ['./scan-dialog.component.scss'],
})
export class ScanDialogComponent implements OnInit {
  scannerEnabled: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ScanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {}

  sendData(result): void {
    this.dialogService.scanSuccess.next(result);
  }

  scanSuccessHandler(result): void {
    this.sendData(result);
  }

  close(): void {
    this.scannerEnabled = false;
    this.dialogRef.close();
  }
}
