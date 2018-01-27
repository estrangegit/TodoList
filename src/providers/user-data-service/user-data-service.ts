import { Injectable } from '@angular/core';

@Injectable()
export class UserDataServiceProvider {

  private userProfile: any;
  private loggedIn: boolean;

  constructor() {
    this.userProfile = null;
    this.loggedIn = false;
  }

  public getUserProfile(){
    return this.userProfile;
  }

  public setUserProfile(userProfile){
    this.userProfile = userProfile;
  }

  public isLoggedIn(): boolean {
    return this.loggedIn;
  }

  public setLoggedIn(value: boolean) {
    this.loggedIn = value;
  }
}
