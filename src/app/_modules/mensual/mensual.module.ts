import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MensualRoutingModule } from './mensual-routing.module';
import { MensualComponent } from 'src/app/_components/mensual/mensual.component';
import { FilterPopupComponent } from 'src/app/_components/filter-popup/filter-popup.component';
import { FilterComponent } from 'src/app/_components/filter/filter.component';


@NgModule({
  declarations: [ MensualComponent, FilterPopupComponent, FilterComponent ],
  imports: [
    CommonModule,
    SharedModule,
    MensualRoutingModule
  ],
  entryComponents: [ FilterPopupComponent ],
})
export class MensualModule { }
