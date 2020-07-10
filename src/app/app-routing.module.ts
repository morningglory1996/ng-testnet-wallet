import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopComponent } from './top/top.component';
import { WalletComponent } from './wallet/wallet.component';
import { AuthModule } from './auth/auth.module';

const routes: Routes = [
  { path: '', component: TopComponent},
  { path: 'wallet/:userId', component: WalletComponent}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
