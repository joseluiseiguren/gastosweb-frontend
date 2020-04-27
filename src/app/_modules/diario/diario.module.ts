import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiarioComponent } from 'src/app/_components/diario/diario.component';
import { DiarioEnterComponent } from '../../_components/diario-enter/diario-enter.component';

import { DiarioRoutingModule } from './diario-routing.module';
import { SharedModule } from './../shared/shared.module';
import { TwoDigitDecimaNumberDirective } from 'src/app/directives/TwoDigitDecimaNumberDirective';

@NgModule({
  declarations: [DiarioComponent, DiarioEnterComponent, TwoDigitDecimaNumberDirective ],
  imports: [
    CommonModule,
    DiarioRoutingModule,
    SharedModule
  ],
  entryComponents: [ DiarioEnterComponent ],
})
export class DiarioModule { }
