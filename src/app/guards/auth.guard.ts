import { UrlConstants } from 'src/app/constants/url.constants';
import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild } from '@angular/router';
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

  private userAlowed(): boolean {
    if (this.userService.isSessionExpired() === false) {
      return true;
    }

    // not logged in so redirect to login page
    this.userService.logout();
    this.router.navigate([UrlConstants.LOGIN]);
    return false;
  }
}
