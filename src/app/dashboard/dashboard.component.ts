import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';

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
  public showUserMenu: boolean = false;
  mobileQuery: MediaQueryList;
  
  constructor(private _userService: UsersService, 
              private router: Router,
              changeDetectorRef: ChangeDetectorRef, 
              media: MediaMatcher) {
    this.userName = this._userService.getUserName();
    this.urlActual = this.router.url;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  private _mobileQueryListener: () => void;

  ngOnInit() {
  }

  route(dest: string) {
    this.showUserMenu = false;
    this.urlActual = dest;
    this.router.navigate([dest]);    
  }

  logout () {
    this._userService.logout();
    this.router.navigate(['/login']);
  }

  shoUserMenu () {
    this.showUserMenu = !this.showUserMenu;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  
}
