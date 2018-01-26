import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class UserDataServiceProvider {

  private userProfile: any;

  constructor() {
    this.userProfile = null;
  }

  public getUserProfile(){
    return this.userProfile;
  }

  public setUserProfile(userProfile){
    this.userProfile = userProfile;
  }
}
