import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable, from } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { WalletService } from './wallet.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";

import { SendDialogComponent } from '../dialog/send/send-dialog.component'
import { UncTxDialogComponent } from '../dialog/unc-tx-dialog/unc-tx-dialog.component';
import { TxDialogComponent } from '../dialog/tx-dialog/tx-dialog.component';
import { AddressDialogComponent } from '../dialog/address-dialog/address-dialog.component';
import { ReceiveDialogComponent } from '../dialog/receive-dialog/receive-dialog.component';

interface Transaction {
  timeStamp: string,
  txId: string,
  blockHeight: number,
  confirmations: number | string
}

interface UncTransaction {
  timeStamp: string,
  txId: string
}

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  userName: string;
  balance: number;
  address: string;
  unconfirmed: UncTransaction[] = [];
  transactions: Transaction[] = [];
  totalSent: number;
  totalReceived: number;
  btcPrice: number;
  spinner: boolean;
  wallet: boolean;

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
      data: {balance: this.balance, btcPrice: this.btcPrice},
      height: '405px',
      width: '500px',
      disableClose: true
    });
  }

  receiveDialog(): void {
    this.dialog.open(ReceiveDialogComponent, {
      data: this.address,
      height: '450px',
      width: '500px',
      disableClose: true
    })
  }

  
  uncTxDialog(): void {
    this.dialog.open(UncTxDialogComponent, {
      data: this.unconfirmed,
      height: '500px',
      disableClose: true
    });
  }

  txDialog() {
    this.dialog.open(TxDialogComponent, {
      data: this.transactions,
      height: '500px',
      disableClose: true
    });
  }

  addressDialog() {
    this.dialog.open(AddressDialogComponent, {
      data: this.address,
      height: '400px',
      width: '500px',
      disableClose: true
    })
  }

  getUserName() {
    this.userName = JSON.parse(localStorage.getItem('app-meta')).userName;
  }

  getAddressDetail() {
    this.wallet = false;
    this.spinner = true;
    this.walletService.getAddressDetail().subscribe(
      (data) => {
        this.balance = data.balance;
        this.address = data.address;
        this.unconfirmed = data.filterUnTxs;
        this.transactions = data.filterTxs;
        this.totalSent = data.totalSent;
        this.totalReceived = data.totalReceived;
        this.btcPrice = data.currentJPY;
        this.spinner = false;
        this.wallet = true;
      },
      (err) => {
        console.log(err);
      }
    )
  }

}
