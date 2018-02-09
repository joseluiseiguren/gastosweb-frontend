import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.loading = true;
    if (this.model.username === "test" && this.model.password === "test"){
      localStorage.setItem('currentUser', this.model.username);
      this.router.navigate(['/dashboard/diario']);
    }
    else {
      this.error = 'Username or password is incorrect';
      this.loading = false;
    }

    /*this.authenticationService.login(this.model.username, this.model.password)
        .subscribe(result => {
            if (result === true) {
                this.router.navigate(['/']);
            } else {
                this.error = 'Username or password is incorrect';
                this.loading = false;
            }
        });*/
  }

}
