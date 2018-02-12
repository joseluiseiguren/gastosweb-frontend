import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';

  constructor(private router: Router, private usersService: UsersService) { }

  ngOnInit() {
  }

  login() {
    this.loading = true;

    this.usersService.login(this.model.username, this.model.password)
            .subscribe(
                data => {
                  console.log(data);
                  if (data === true) {
                    this.router.navigate(['/dashboard/diario']);
                  }
                  else {
                    this.error = 'Username or password is incorrect';
                    this.loading = false;      
                  }
                },
                error => {
                  console.log("error");  
                  this.loading = false;
                });

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
