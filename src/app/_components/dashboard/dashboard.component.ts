import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material';
import { AboutComponent } from '../about/about.component';
import { ComponentBase } from '../../services/ComponentBase';
import { MediaMatcher } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';
import { UrlConstants } from '../../constants/url.constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends ComponentBase implements OnInit, OnDestroy {
  userName: string;
  actualPageTitle: string;
  private _subscriptions = new Subscription();

  constructor(private _userService: UsersService,
              private router: Router,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher,
              public aboutDialog: MatDialog) {
    super(changeDetectorRef, media);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.actualPageTitle = this.getPageTitle(event.url);
      });
  }

  ngOnInit() {
    this._subscriptions.add(this._userService.userName
      .subscribe((username) => {
        this.userName = username;
      })
    );
  }

  private route(dest: string) {
    const currentUrlSplitted = this.router.url.split('/');

    if (currentUrlSplitted.length >= 3 &&
        currentUrlSplitted[2] === dest.split('/')[0]) {
        return;
    } else {
      this.router.navigate([UrlConstants.DASHBOARD + '/' + dest]);
    }
  }

  routeDiario () {
    this.route(UrlConstants.DIARIO + '/today');
  }

  routeMensual () {
    this.route(UrlConstants.MENSUAL + '/current/none');
  }

  routeAnual () {
    this.route(UrlConstants.ANUAL + '/current/none');
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
    this._subscriptions.unsubscribe();
    super.ngOnDestroy();
  }

  about(): void {
    this.aboutDialog.open(AboutComponent, {
      width: '250px'
    });
  }

  getPageTitle(url: string): string {
    const prefix = '/' + UrlConstants.DASHBOARD + '/';

    if (url.startsWith(prefix + UrlConstants.DIARIO)) {
      return ' - Diario';
    }

    if (url.startsWith(prefix + UrlConstants.MENSUAL)) {
      return ' - Mensual';
    }

    if (url.startsWith(prefix + UrlConstants.ANUAL)) {
      return ' - Anual';
    }

    if (url.startsWith(prefix + UrlConstants.HISTORICO)) {
      return ' - Histórico';
    }

    if (url.startsWith(prefix + UrlConstants.CONCEPTOS)) {
      return ' - Conceptos';
    }

    if (url.startsWith(prefix + UrlConstants.USERPROFILE)) {
      return ' - Perfil';
    }

    return '';
  }
}
