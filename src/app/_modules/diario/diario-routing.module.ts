import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiarioComponent } from 'src/app/_components/diario/diario.component';

const routes: Routes = [
  { path: ':day', component: DiarioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DiarioRoutingModule { }
