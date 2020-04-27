import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MensualRoutingModule } from './mensual-routing.module';
import { MensualComponent } from 'src/app/_components/mensual/mensual.component';


@NgModule({
  declarations: [ MensualComponent ],
  imports: [
    CommonModule,
    SharedModule,
    MensualRoutingModule
  ]
})
export class MensualModule { }
