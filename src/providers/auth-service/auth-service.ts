import { Injectable } from '@angular/core';

@Injectable()
export class AuthServiceProvider {

  private isLoggedIn = false;

  constructor() {}

  login() : void {
    this.isLoggedIn = true;
  }

  logout() : void {
    this.isLoggedIn = false;
  }

  authenticated() : boolean {
    return this.isLoggedIn;
  }

}
