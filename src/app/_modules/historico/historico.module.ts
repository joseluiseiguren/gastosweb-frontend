import { HistoricoComponent } from '../../_components/historico/historico.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoricoRoutingModule } from './historico-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [HistoricoComponent],
  imports: [
    CommonModule,
    HistoricoRoutingModule,
    SharedModule
  ]
})
export class HistoricoModule { }
