import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UrlConstants } from 'src/app/constants/url.constants';
import { UserprofileComponent } from 'src/app/_components/userprofile/userprofile.component';
import { RegistracionComponent } from 'src/app/_components/registracion/registracion.component';

const routes: Routes = [
  {path: UrlConstants.USERPROFILE, component: UserprofileComponent},
  {path: UrlConstants.REGISTRACION, component: RegistracionComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
