import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { WalletModule } from './wallet/wallet.module';

import { TopComponent } from './top/top.component';

const routes: Routes = [{ path: '', component: TopComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes), AuthModule, WalletModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
