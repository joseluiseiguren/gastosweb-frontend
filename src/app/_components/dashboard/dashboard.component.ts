import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AboutComponent } from '../about/about.component';
import { ComponentBase } from '../../services/ComponentBase';
import { MediaMatcher } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { UrlConstants } from '../../constants/url.constants';

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
          this.actualPageTitle = this.getPageTitle(event.url);
      });
  }

  ngOnInit() {
  }

  private route(dest: string) {
    let currentUrlSplitted = this.router.url.split('/');

    if (currentUrlSplitted.length >= 3 &&
        currentUrlSplitted[2] === dest.split('/')[0]){
        return;
    } else {
      this.router.navigate([UrlConstants.DASHBOARD + '/' + dest]);
    }
  }

  routeDiario () {
    this.route(UrlConstants.DIARIO + "/today");
  }

  routeMensual () {
    this.route(UrlConstants.MENSUAL + "/current/none");
  }

  routeAnual () {
    this.route(UrlConstants.ANUAL + "/current/none");
  }

  routeHistorico () {
    this.route(UrlConstants.HISTORICO);
  }

  routeConceptos () {
    this.route(UrlConstants.CONCEPTOS);
  }

  routeUserProfile () {
    this.route(UrlConstants.USERS + '/' + UrlConstants.USERPROFILE);
  }

  logout () {
    this._userService.logout();
    this.router.navigate(['/' + UrlConstants.LOGIN]);
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
    let prefix = "/" + UrlConstants.DASHBOARD + "/";

    if (url.startsWith(prefix + UrlConstants.DIARIO)){
      return " - Diario";
    }

    if (url.startsWith(prefix + UrlConstants.MENSUAL)){
      return " - Mensual";
    }

    if (url.startsWith(prefix + UrlConstants.ANUAL)){
      return " - Anual";
    }

    if (url.startsWith(prefix + UrlConstants.HISTORICO)){
      return " - Histórico";
    }

    if (url.startsWith(prefix + UrlConstants.CONCEPTOS)){
      return " - Conceptos";
    }

    if (url.startsWith(prefix + UrlConstants.USERPROFILE)){
      return " - Perfil";
    }

    return "";
  }
}
