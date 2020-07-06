import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WalletService } from './wallet.service';
import { WalletComponent } from './wallet.component';
import { AuthGuard } from '../auth/shared/auth.guard';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from "@angular/material/dialog";

const routes: Routes = [
  { path: 'wallet/:userId', component: WalletComponent, canActivate: [AuthGuard]}
];

@NgModule({
  declarations: [
    WalletComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatBadgeModule,
    MatDialogModule
  ],
  providers: [
    WalletService
  ]
})
export class WalletModule { }
