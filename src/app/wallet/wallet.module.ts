import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WalletService } from './wallet.service';
import { WalletComponent } from './wallet.component';
import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'wallet/:userId', component: WalletComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    WalletComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    WalletService
  ]
})
export class WalletModule { }
