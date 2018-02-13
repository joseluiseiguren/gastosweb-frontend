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
  menuActivo: string = 'D';

  constructor(private _userService: UsersService, private router: Router) {
    this.userName = this._userService.getUserName();
  }

  ngOnInit() {
  }

  route(dest: string) {
    switch (dest) {
      case 'D':
        this.router.navigate(['/dashboard/diario']);
        break;

      case 'M':
        this.router.navigate(['/dashboard/mensual']);
        break;

      case 'A':
        this.router.navigate(['/dashboard/anual']);
        break;

      case 'H':
        this.router.navigate(['/dashboard/historico']);
        break;

      case 'C':
        this.router.navigate(['/dashboard/conceptos']);
        break;
    }

    this.menuActivo = dest;
  }

  logout () {
    this._userService.logout();
    this.router.navigate(['/login']);
  }

}
