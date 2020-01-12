import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AboutComponent } from '../about/about.component';
import { ComponentBase } from '../services/ComponentBase';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends ComponentBase implements OnInit {
  userName: string;
  public urlActual = '';
  public urlDiario: string = '/dashboard/diario';
  public urlMensual: string = '/dashboard/mensual';
  public urlAnual: string = '/dashboard/anual';
  public urlHistorico: string = '/dashboard/historico';
  public urlConceptos: string = '/dashboard/conceptos';
  public showUserMenu: boolean = false;
  
  constructor(private _userService: UsersService, 
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef, 
              private media: MediaMatcher,
              public aboutDialog: MatDialog) {
    super(changeDetectorRef, media);
    this.userName = this._userService.getUserName();
    this.urlActual = this.router.url;        
  }

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
    super.ngOnDestroy();
  }

  about(): void {
    const dialogRef = this.aboutDialog.open(AboutComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');      
    });
  }
}
