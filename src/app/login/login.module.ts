import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
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
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { LoginComponent } from './login.component';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { environment } from 'src/environments/environment';

const routes: Routes = [    
  { path: 'login', component: LoginComponent}
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: []
})
export class LoginModule { }
