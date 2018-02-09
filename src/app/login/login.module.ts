import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { FormsModule }   from '@angular/forms';

const routes: Routes = [    
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: PreloadAllModules }),
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
