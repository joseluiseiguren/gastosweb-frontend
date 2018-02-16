import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DiarioComponent } from './diario/diario.component';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MensualComponent } from './mensual/mensual.component';
import { AnualComponent } from './anual/anual.component';
import { HistoricoComponent } from './historico/historico.component';
import { ConceptosComponent } from './conceptos/conceptos.component';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SumarydiaComponent } from './sumarydia/sumarydia.component';
import { SumarymesComponent } from './sumarymes/sumarymes.component';
import { HttpClientModule } from '@angular/common/http';
import { SumaryMonthService } from './services/sumary-month.service';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { DiarioService } from './services/diario.service';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { CurrencyMaskModule } from "ng2-currency-mask";
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

const routes: Routes = [    
  { path: '', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent, canActivateChild: [AuthGuard],
                          children: [
                            { path: 'diario', component: DiarioComponent},
                            { path: 'mensual', component: MensualComponent },
                            { path: 'anual', component: AnualComponent },
                            { path: 'historico', component: HistoricoComponent },
                            { path: 'conceptos', component: ConceptosComponent },
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
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    LoginModule,
    ModalModule,
    HttpClientModule,
    CurrencyMaskModule,
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules }),
  ],
  providers: [SumaryMonthService, 
              DiarioService, 
              BsModalService,
              UsersService, 
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
              LocalizacionService,
              { provide: LOCALE_ID,
                useValue: window.navigator.language }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
