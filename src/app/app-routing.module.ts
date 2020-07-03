import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TopComponent } from './top/top.component';
import { WalletComponent } from './wallet/wallet.component';


const routes: Routes = [
  { path: '', component: TopComponent},
  { path: 'wallet', component: WalletComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
