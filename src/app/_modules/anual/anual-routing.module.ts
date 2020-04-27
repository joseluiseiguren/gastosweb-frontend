import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnualComponent } from 'src/app/_components/anual/anual.component';

const routes: Routes = [
  { path: ':anio/:open', component: AnualComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnualRoutingModule { }
