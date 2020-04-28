import { HelperService } from './../../services/helper.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { IpService } from '../../services/ip.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { UrlConstants } from '../../constants/url.constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    loading = false;
    location: any = {};
    loginForm: FormGroup;
    private _subscriptions = new Subscription();
    public registerUrl = '/' + UrlConstants.USERS + '/' + UrlConstants.REGISTRACION;

    constructor(private router: Router,
                private formBuilder: FormBuilder,
                private usersService: UsersService,
                private _helperService: HelperService,
                public snackBar: MatSnackBar,
                private _ipService: IpService) {
      if (this.usersService.isSessionExpired() === false) {
        this.ingresarApp();
      }

      this.location.height = window.screen.height;
      this.location.width = window.screen.width;
      this.location.appCodeName = window.navigator.appCodeName;
      this.location.appVersion = window.navigator.appVersion;
      this.location.language = window.navigator.language;
      this.location.platform = window.navigator.platform;
      this.location.userAgent = window.navigator.userAgent;

      this._subscriptions.add(this._ipService.getClientIp()
        .subscribe(
          data => {
            this.location.ip = data.ip;
            this.location.city = data.city;
            this.location.region = data.region;
            this.location.region_code = data.region_code;
            this.location.country = data.country;
            this.location.country_name = data.country_name;
            this.location.continent_code = data.continent_code;
            this.location.postal = data.postal;
            this.location.latitude = data.latitude;
            this.location.longitude = data.longitude;
            this.location.timezone = data.timezone;
            this.location.utc_offset = data.utc_offset;
            this.location.country_calling_code = data.country_calling_code;
            this.location.currency = data.currency;
            this.location.languages = data.languages;
            this.location.asn = data.asn;
            this.location.org = data.org;
          },
          error => {
            console.log(error);
        })
      );
    }

    ngOnInit() {
      this.loginForm = this.formBuilder.group({
        emailFormControl: ['', [Validators.required, Validators.email]],
        pwdFormControl: ['', [Validators.required]]
      });
    }

    ngOnDestroy(): void {
      this._subscriptions.unsubscribe();
    }

    login() {
      this.loading = true;

      this._subscriptions.add(this.usersService.login(this.loginForm.value.emailFormControl, this.loginForm.value.pwdFormControl,
                              JSON.stringify(this.location))
        .subscribe(
            data => {
              if (data === true) {
                this.loading = false;
                this.ingresarApp();
              } else {
                this._helperService.showSnackBarError(this.snackBar, 'Acceso Denegado');
                this.loading = false;
              }
            },
            error => {
              let errorMessage: string;
              if (error.status === 401) {
                errorMessage = 'Acceso Denegado';
              } else {
                errorMessage = 'Error inesperado: ';
                if (error.error.errorId !== undefined) {
                  errorMessage += error.error.errorId;
                }
              }

              this.loading = false;
              this._helperService.showSnackBarError(this.snackBar, errorMessage);

            })
      );
    }

    private ingresarApp () {
      this.router.navigate([UrlConstants.DASHBOARD + '/' + UrlConstants.DIARIO + '/today']);
    }
}
