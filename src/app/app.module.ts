import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DiarioComponent } from './diario/diario.component';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MensualComponent } from './mensual/mensual.component';
import { AnualComponent } from './anual/anual.component';
import { HistoricoComponent } from './historico/historico.component';
import { ConceptosComponent } from './conceptos/conceptos.component';
/*import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';*/
import { SumarydiaComponent } from './sumarydia/sumarydia.component';
import { SumarymesComponent } from './sumarymes/sumarymes.component';
import { HttpClientModule } from '@angular/common/http';
import { SumaryMonthService } from './services/sumary-month.service';
import { SumaryAnioService } from './services/sumary-anio.service';
import { SumaryHistoricoService } from './services/sumary-historico.service';
import { DiarioService } from './services/diario.service';
//import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
//import { CurrencyMaskModule } from "ng2-currency-mask";
import { LoginModule } from './login/login.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { UsersService } from './services/users.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { APP_CONFIG, APP_DI_CONFIG } from "./app.config/app-config.constants";
import { LocalizacionService } from './services/localizacion.service';
import { LOCALE_ID } from '@angular/core';
import { ConceptoService } from './services/concepto.service';
import { RegistracionComponent } from './registracion/registracion.component';
import { LoadingComponent } from './loading/loading.component';
import { HelperService } from './services/helper.service';
import { UrlService } from './services/url.service';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { SumaryanioComponent } from './sumaryanio/sumaryanio.component';
import { UserprofileComponent } from './userprofile/userprofile.component';
import { SumaryhistoricoComponent } from './sumaryhistorico/sumaryhistorico.component';
import { HashLocationStrategy, LocationStrategy, CurrencyPipe } from '@angular/common';
import { IpService } from './services/ip.service';
import { MatToolbarModule, 
  MatCardModule, 
  MatButtonModule, 
  MatButtonToggleModule, 
  MatBadgeModule, 
  MatProgressSpinnerModule,
  MatFormFieldModule,
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
  MatTableModule,
  MatDatepickerModule } from  '@angular/material';
import { MatIconModule  } from '@angular/material/icon';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatListModule } from '@angular/material/list';
import { AboutComponent } from './about/about.component';
import { DiarioEnterComponent } from './diario-enter/diario-enter.component';
import { TwoDigitDecimaNumberDirective } from './directives/TwoDigitDecimaNumberDirective';
import { FormatingService } from './sharedServices/formatingService';

const routes: Routes = [    
  { path: '', component: LoginComponent},
  { path: 'registracion', component: RegistracionComponent},
  { path: 'dashboard', component: DashboardComponent, canActivateChild: [AuthGuard],
                          children: [
                            { path: 'diario', component: DiarioComponent},
                            { path: 'mensual', component: MensualComponent },
                            { path: 'anual', component: AnualComponent },
                            { path: 'historico', component: HistoricoComponent },
                            { path: 'conceptos', component: ConceptosComponent },
                            { path: 'userprofile', component: UserprofileComponent },
                            { path: '', component: DiarioComponent },
                          ]},
  { path: '**', redirectTo: '/dashboard/diario', pathMatch: 'full'}
];  

@NgModule({
  declarations: [
    AppComponent,
    DiarioComponent,
    MensualComponent,
    AnualComponent,
    HistoricoComponent,
    ConceptosComponent,
    SumarydiaComponent,
    SumarymesComponent,
    DashboardComponent,
    RegistracionComponent,
    LoadingComponent,
    ErrorMessageComponent,
    SumaryanioComponent,
    UserprofileComponent,
    SumaryhistoricoComponent,
    AboutComponent,
    DiarioEnterComponent,    
    TwoDigitDecimaNumberDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    LoginModule,
    //ModalModule,
    HttpClientModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
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
    MatTableModule,
    MatListModule,
    MatRadioModule,
    //CurrencyMaskModule,
    /*ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),*/
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules }),
  ],
  providers: [SumaryMonthService,
              SumaryAnioService,
              SumaryHistoricoService,
              DiarioService, 
              //BsModalService,
              UsersService,
              ConceptoService, 
              IpService,
              HelperService,
              FormatingService,
              UrlService,
              CurrencyPipe,
              AuthGuard ,
              {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true,
              },
              {
                provide: APP_CONFIG,
                useValue: APP_DI_CONFIG
              },
              {provide: LocationStrategy, useClass: HashLocationStrategy},
              LocalizacionService,
              { provide: LOCALE_ID,
                useValue: window.navigator.language 
              },
              { provide: MAT_RADIO_DEFAULT_OPTIONS,
                useValue: { color: 'accent' }
              },
            ],
  entryComponents: [ AboutComponent, DiarioEnterComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
