import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendDialogComponent } from './send/send-dialog.component';
import { TxDialogComponent } from './tx-dialog/tx-dialog.component';
import { UncTxDialogComponent } from './unc-tx-dialog/unc-tx-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';



@NgModule({
  declarations: [
    SendDialogComponent,
    TxDialogComponent,
    UncTxDialogComponent
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
    MatPaginatorModule
  ]
})
export class DialogModule { }
