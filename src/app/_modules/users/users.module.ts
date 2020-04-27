import { WelcomeComponent } from '../../_components/welcome/welcome.component';
import { RegistracionComponent } from '../../_components/registracion/registracion.component';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserprofileComponent } from 'src/app/_components/userprofile/userprofile.component';
import { ErrorMessageComponent } from 'src/app/_components/error-message/error-message.component';

@NgModule({
  declarations: [ UserprofileComponent, RegistracionComponent, WelcomeComponent, ErrorMessageComponent ],
  imports: [
    CommonModule,
    SharedModule,
    UsersRoutingModule
  ],
  entryComponents: [ WelcomeComponent ],
})
export class UsersModule { }
