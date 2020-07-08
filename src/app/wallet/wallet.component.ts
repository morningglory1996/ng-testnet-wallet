import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { WalletService } from './wallet.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";

import { SendDialogComponent } from '../dialog/send/send-dialog.component'

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  userName: string;
  balance: number;
  address: string;
  unconfirmed: number;
  transactions: number;
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

  openDialog(): void {
    this.dialog.open(SendDialogComponent, {
      height: '400px',
      width: '600px',
      disableClose: true
    });
  }

  getUserName() {
    this.userName = JSON.parse(localStorage.getItem('app-meta')).userName;
  }

  getAddressDetail() {
    this.walletService.getAddressDetail().subscribe(
      (data) => {
        console.log(data);
        this.address = data.address;
        this.balance = data.final_balance;
        this.unconfirmed = data.unconfirmed_n_tx;
        this.transactions = data.final_n_tx;
        this.totalSent = data.total_sent;
        this.totalReceived = data.totalReceived;
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
