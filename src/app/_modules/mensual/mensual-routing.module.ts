import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MensualComponent } from 'src/app/_components/mensual/mensual.component';

const routes: Routes = [
  { path: ':month/:open', component: MensualComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MensualRoutingModule { }
