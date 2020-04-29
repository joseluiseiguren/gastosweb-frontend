import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SharedModule } from './_modules/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material';

import { SumaryMonthService } from './services/sumary-month.service';
import { SumaryAnioService } from './services/sumary-anio.service';
import { SumaryHistoricoService } from './services/sumary-historico.service';
import { DiarioService } from './services/diario.service';
import { DashboardComponent } from './_components/dashboard/dashboard.component';
import { UsersService } from './services/users.service';
import { ConceptoService } from './services/concepto.service';
import { HelperService } from './services/helper.service';
import { UrlService } from './services/url.service';
import { IpService } from './services/ip.service';
import { FormatingService } from './sharedServices/formatingService';
import { CalculationService } from './sharedServices/calculationService';

import { AuthGuard } from './guards/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { LOCALE_ID } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, CurrencyPipe, registerLocaleData, DatePipe } from '@angular/common';
import { UrlConstants } from './constants/url.constants';

import { AppComponent } from './app.component';
import { LoginComponent } from './_components/login/login.component';
import { AboutComponent } from './_components/about/about.component';

import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
registerLocaleData(localeEs, localeEs);
registerLocaleData(localeEn, localeEn);

const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: UrlConstants.LOGIN, component: LoginComponent },

  { path: UrlConstants.USERS,
    loadChildren: () => import('./_modules/users/users.module').then(m => m.UsersModule) },

  { path: UrlConstants.DASHBOARD, component: DashboardComponent, canActivateChild: [AuthGuard],
                          children: [

                            { path: UrlConstants.DIARIO,
                              loadChildren: () => import('./_modules/diario/diario.module').then(m => m.DiarioModule) },

                            { path: UrlConstants.MENSUAL,
                              loadChildren: () => import('./_modules/mensual/mensual.module').then(m => m.MensualModule) },

                            { path: UrlConstants.ANUAL,
                              loadChildren: () => import('./_modules/anual/anual.module').then(m => m.AnualModule) },

                            { path: UrlConstants.HISTORICO,
                              loadChildren: () => import('./_modules/historico/historico.module').then(m => m.HistoricoModule) },

                            { path: UrlConstants.CONCEPTOS,
                              loadChildren: () => import('./_modules/concepts/concepts.module').then(m => m.ConceptsModule) },

                            { path: UrlConstants.USERS,
                              loadChildren: () => import('./_modules/users/users.module').then(m => m.UsersModule) },

                            { path: '',
                              loadChildren: () => import('./_modules/diario/diario.module').then(m => m.DiarioModule) },
                          ]},
  { path: '**', redirectTo: UrlConstants.DASHBOARD}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatToolbarModule,
    SharedModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
  ],
  providers: [SumaryMonthService,
              SumaryAnioService,
              SumaryHistoricoService,
              DiarioService,
              UsersService,
              ConceptoService,
              IpService,
              HelperService,
              FormatingService,
              CalculationService,
              UrlService,
              CurrencyPipe,
              DatePipe,
              AuthGuard,
              {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true,
              },
              {
                provide: LocationStrategy,
                useClass: HashLocationStrategy
              },
              {
                provide: LOCALE_ID,
                useValue: window.navigator.language.split('-')[0]
              }
            ],
  entryComponents: [ AboutComponent ],
  bootstrap: [AppComponent]
})
export class AppModule { }
