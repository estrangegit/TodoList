import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()
export class UserDataService {

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
