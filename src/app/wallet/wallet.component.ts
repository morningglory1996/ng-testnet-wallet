import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { WalletService } from './wallet.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from "@angular/material/dialog";

import { DialogComponent } from '../dialog/dialog.component'

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  userName: string;

  balance: number = 12113;

  address: string = '1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX';

  numberTx: number;

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
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
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
        this.numberTx = data.final_n_tx;
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
