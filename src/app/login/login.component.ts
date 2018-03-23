import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { IpService } from '../services/ip.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error: string = "";
    location: any = {};
  
    constructor(private router: Router, 
                private usersService: UsersService,
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

      this._ipService.getClientIp()
        .subscribe(
          data => { 
            this.location.ip = data.ip;
            this.location.country_code = data.country_code;
            this.location.country_name = data.country_name;
            this.location.region_code = data.region_code;
            this.location.region_name = data.region_name;
            this.location.city = data.city;
            this.location.zip_code = data.zip_code;
            this.location.time_zone = data.time_zone;
            this.location.latitude = data.latitude;
            this.location.longitude = data.longitude;
            this.location.metro_code = data.metro_code;
          },
          error => {
            console.log(error);
      });
    }

    ngOnInit() {
    }

    login() {
      this.error = "";
      this.loading = true;

      this.usersService.login(this.model.username, this.model.password, JSON.stringify(this.location))
              .subscribe(
                  data => {
                    if (data === true) {
                      this.loading = false;
                      this.ingresarApp();          
                    }
                    else {
                      this.error = 'Acceso Denegado';
                      this.loading = false;
                    }
                  },
                  error => {
                    if (error.status === 401) {
                      this.error = 'Acceso Denegado';
                    }
                    else {
                      this.error = "Error inesperado";
                      if (error.error.errorId != undefined) {
                        this.error += "<br/>" + error.error.errorId;
                      }
                    }
                    
                    this.loading = false;
                  });
    }

    private ingresarApp () {
      this.router.navigate(['/dashboard/diario']);
    }
}
