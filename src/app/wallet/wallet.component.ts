import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { WalletService } from './wallet.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";

import { SendDialogComponent } from '../dialog/send/send-dialog.component'
import { UncTxDialogComponent } from '../dialog/unc-tx-dialog/unc-tx-dialog.component';
import { TxDialogComponent } from '../dialog/tx-dialog/tx-dialog.component';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  userName: string;
  balance: number;
  address: string;
  unconfirmed: [];
  transactions: [];
  totalSent: number;
  totalReceived: number;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  constructor(
    private walletService: WalletService,
    private router: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog
    ) {}

  ngOnInit(): void {
    this.getUserName();
    this.getAddressDetail();
  }

  sendDialog(): void {
    this.dialog.open(SendDialogComponent, {
      height: '400px',
      width: '600px',
      disableClose: true
    });
  }

  
  uncTxDialog(): void {
    this.dialog.open(UncTxDialogComponent, {
      data: this.unconfirmed,
      disableClose: true
    });
  }

  txDialog() {
    this.dialog.open(TxDialogComponent, {
      data: this.transactions,
      disableClose: true
    });
  }

  getUserName() {
    this.userName = JSON.parse(localStorage.getItem('app-meta')).userName;
  }

  getAddressDetail() {
    this.walletService.getAddressDetail().subscribe(
      (data) => {
        console.log(data.filterUnTxs);
        this.balance = data.balance * 1e-8;
        this.address = data.address;
        this.unconfirmed = data.filterUnTxs;
        this.transactions = data.filterTxs;
        this.totalSent = data.totalSent * 1e-8;
        this.totalReceived = data.totalReceived * 1e-8;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  pushTransaction(transactionForm) {
    this.walletService.pushTransaction(transactionForm.value).subscribe(
      (result) => {
        console.log(result);
      },
      (err) => {
        console.log(err);
      }
    )
  }
}
