import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendDialogComponent } from './send/send-dialog.component';
import { TxDialogComponent } from './tx-dialog/tx-dialog.component';
import { UncTxDialogComponent } from './unc-tx-dialog/unc-tx-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { QRCodeModule } from 'angularx-qrcode';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AddressDialogComponent } from './address-dialog/address-dialog.component';
import { ReceiveDialogComponent } from './receive-dialog/receive-dialog.component';


@NgModule({
  declarations: [
    SendDialogComponent,
    TxDialogComponent,
    UncTxDialogComponent,
    ConfirmDialogComponent,
    AddressDialogComponent,
    ReceiveDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    QRCodeModule
  ]
})
export class DialogModule { }
