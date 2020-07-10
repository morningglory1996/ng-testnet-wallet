import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

interface Transaction {
  timeStamp: string,
  txId: string,
  blockHeight: number,
  confirmations: number | string
}

@Component({
  selector: 'app-tx-dialog',
  templateUrl: './tx-dialog.component.html',
  styleUrls: ['./tx-dialog.component.scss']
})
export class TxDialogComponent implements OnInit {
  displayedColumns: string[] = ['timeStamp', 'txId'];
  dataSource = new MatTableDataSource<Transaction>(this.data);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : Transaction[],
    public dialogRef: MatDialogRef<TxDialogComponent>
  ) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  close(): void {
    this.dialogRef.close();
  }
}
