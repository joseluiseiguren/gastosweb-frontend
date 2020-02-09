import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UsersService } from '../services/users.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AboutComponent } from '../about/about.component';
import { ComponentBase } from '../services/ComponentBase';
import { MediaMatcher } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends ComponentBase implements OnInit {
  userName: string;
  actualPageTitle: string;
  constructor(private _userService: UsersService, 
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef, 
              private media: MediaMatcher,
              public aboutDialog: MatDialog) {
    super(changeDetectorRef, media);
    this.userName = this._userService.getUserName();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          console.log(event.url);
          this.actualPageTitle = this.getPageTitle(event.url);
      });
  }

  ngOnInit() {    
  }

  route(dest: string) {
    this.router.navigate(['dashboard/' + dest]);    
  }

  logout () {
    this._userService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  about(): void {
    const dialogRef = this.aboutDialog.open(AboutComponent, {
      width: '250px'
    });    
  }  

  getPageTitle(url:string): string {
    let prefix = "/dashboard/";
    switch (url){
      case prefix + "diario":
        return " - Diario";
      case prefix + "mensual":
        return " - Mensual";
      case prefix + "anual":
        return " - Anual";
      case prefix + "historico":
        return " - Histórico";
      case prefix + "conceptos":
        return " - Conceptos";
      case prefix + "userprofile":
        return " - Perfil";
      default:
        return "";        
    }
  }  
}
