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
  
    constructor(private router: Router, private usersService: UsersService) { 
      if (this.usersService.isSessionExpired() === false) {
        this.ingresarApp();
      }
    }

    ngOnInit() {
    }

    login() {
      this.loading = true;

      this.usersService.login(this.model.username, this.model.password)
              .subscribe(
                  data => {
                    if (data === true) {
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
                      this.error = 'Error inesperado';
                    }
                    
                    this.loading = false;
                  });
    }

    private ingresarApp () {
      this.router.navigate(['/dashboard/diario']);
    }
}
