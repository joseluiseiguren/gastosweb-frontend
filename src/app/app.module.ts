/*import 'core-js/es6/reflect';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import 'hammerjs';
import 'web-animations-js';
*/
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DiarioComponent } from './diario/diario.component';
import { RouterModule } from '@angular/router';
import { MensualComponent } from './mensual/mensual.component';
import { AnualComponent } from './anual/anual.component';
import { HistoricoComponent } from './historico/historico.component';
import { ConceptosComponent } from './conceptos/conceptos.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SumarydiaComponent } from './sumarydia/sumarydia.component';
import { SumarymesComponent } from './sumarymes/sumarymes.component';
import { SumaryDayService } from './services/sumary-day.service';
import { HttpClientModule } from '@angular/common/http';
import { SumaryMonthService } from './services/sumary-month.service';

/*import {CdkTableModule} from '@angular/cdk/table';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

/*import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
} from '@angular/material';*/

@NgModule({
  declarations: [
    AppComponent,
    DiarioComponent,
    MensualComponent,
    AnualComponent,
    HistoricoComponent,
    ConceptosComponent,
    SumarydiaComponent,
    SumarymesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    RouterModule.forRoot([
      { path: 'diario', component: DiarioComponent },
      { path: 'mensual', component: MensualComponent },
      { path: 'anual', component: AnualComponent },
      { path: 'historico', component: HistoricoComponent },
      { path: 'conceptos', component: ConceptosComponent },
      { path: '', redirectTo: 'diario', pathMatch: 'full'},
      { path: '**', redirectTo: 'diario', pathMatch: 'full'}
  ]),
  ],
  providers: [SumaryDayService, SumaryMonthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
