import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

interface UncTransaction {
  timeStamp: string;
  txId: string;
  type: string;
}

@Component({
  selector: 'app-unc-tx-dialog',
  templateUrl: './unc-tx-dialog.component.html',
  styleUrls: ['./unc-tx-dialog.component.scss'],
})
export class UncTxDialogComponent implements OnInit {
  displayedColumns: string[] = ['date', 'txId'];
  dataSource = new MatTableDataSource<UncTransaction>(this.data);

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: UncTransaction[],
    private breakpointObserver: BreakpointObserver,
    public dialogRef: MatDialogRef<UncTxDialogComponent>
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  close(): void {
    this.dialogRef.close();
  }
}
