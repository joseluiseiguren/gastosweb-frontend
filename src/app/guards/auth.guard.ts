import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UsersService } from '../services/users.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router, private userService: UsersService) { }
  
  canActivate() {
    return this.userAlowed();
  }

  canActivateChild() {
    return this.userAlowed();
  }

  private userAlowed():boolean{
    if (this.userService.isSessionExpired() === false) {
      return true;
    }

    // not logged in so redirect to login page
    this.router.navigate(['/login']);
    return false;
  }
}
