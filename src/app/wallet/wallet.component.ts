import { Component, OnInit } from '@angular/core';
import { WalletService } from './wallet.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
  balance;
  constructor(
    private walletService: WalletService,
    private router: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    this.getAddressDetail();
  }

  getAddressDetail() {
    this.walletService.getAddressDetail().subscribe(
      (data) => {
        this.balance = data;
      },
      (err) => {
        console.log(err);
      }
    )
    // return this.http.get('/api/v1/wallet:userId');
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
