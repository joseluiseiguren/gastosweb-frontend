import { Component, OnInit } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userName: string;
  public urlActual = '';
  public urlDiario: string = '/dashboard/diario';
  public urlMensual: string = '/dashboard/mensual';
  public urlAnual: string = '/dashboard/anual';
  public urlHistorico: string = '/dashboard/historico';
  public urlConceptos: string = '/dashboard/conceptos';

  constructor(private _userService: UsersService, private router: Router) {
    this.userName = this._userService.getUserName();
    this.urlActual = this.router.url;
  }

  ngOnInit() {
  }

  route(dest: string) {
    this.urlActual = dest;
    this.router.navigate([dest]);
  }

  logout () {
    this._userService.logout();
    this.router.navigate(['/login']);
  }

}
