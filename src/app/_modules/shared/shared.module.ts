
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule,
         MatTableModule,
         MatFormFieldModule,
         MatButtonModule,
         MatCardModule,
         MatButtonToggleModule,
         MatBadgeModule,
         MatNativeDateModule,
         MatInputModule,
         MatSelectModule,
         MatSlideToggleModule,
         MatSidenavModule,
         MatExpansionModule,
         MatGridListModule,
         MatTabsModule,
         MatDialogModule,
         MatSnackBarModule,
         MatDatepickerModule,
         MatTooltipModule,
         MatAutocompleteModule,
         MatRadioModule } from '@angular/material';
import { MatIconModule  } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SaldoComponent } from 'src/app/_components/saldo/saldo.component';
import { SaldoAbiertoComponent } from '../../_components/saldo-abierto/saldo-abierto.component';
import { SaldoItemComponent } from '../../_components/saldo-item/saldo-item.component';

@NgModule({
  declarations: [SaldoComponent, SaldoAbiertoComponent, SaldoItemComponent],
  imports: [
    CommonModule,
    MatChipsModule,
    MatDialogModule,
    MatCardModule,
    MatAutocompleteModule,
    MatListModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  exports: [
    SaldoComponent,
    SaldoAbiertoComponent,
    SaldoItemComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatExpansionModule,
    MatGridListModule,
    MatTabsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatTooltipModule,
    MatRadioModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  entryComponents: [ SaldoAbiertoComponent ],
})
export class SharedModule { }
