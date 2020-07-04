import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { TopComponent } from './top/top.component';
import { WalletModule } from './wallet/wallet.module';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TopComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    WalletModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
