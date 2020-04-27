import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnualRoutingModule } from './anual-routing.module';
import { AnualComponent } from 'src/app/_components/anual/anual.component';


@NgModule({
  declarations: [AnualComponent],
  imports: [
    CommonModule,
    SharedModule,
    AnualRoutingModule
  ]
})
export class AnualModule { }
