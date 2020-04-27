import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from './../shared/shared.module';

import { ConceptsRoutingModule } from './concepts-routing.module';
import { ConceptosComponent } from 'src/app/_components/conceptos/conceptos.component';
import { ConceptoDialogComponent } from 'src/app/_components/concepto-dialog/concepto-dialog.component';


@NgModule({
  declarations: [ConceptosComponent, ConceptoDialogComponent],
  imports: [
    CommonModule,
    SharedModule,
    ConceptsRoutingModule
  ],
  entryComponents: [ ConceptoDialogComponent ],
})
export class ConceptsModule { }
