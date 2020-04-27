import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConceptosComponent } from 'src/app/_components/conceptos/conceptos.component';

const routes: Routes = [
  { path: '', component: ConceptosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConceptsRoutingModule { }
