import { Component } from '@angular/core';
import {App, NavController} from 'ionic-angular';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {auth} from 'firebase/app';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public navCtrl: NavController,
              public userDataServiceProvider: UserDataServiceProvider,
              public app: App) {
  }

  public logInfos(){
    console.log(this.userDataServiceProvider.getUserProfile());
  }

  public googleLogout():void {
    auth().signOut().then(()=>{
      this.app.getRootNav().setRoot(LoginPage);
    }, error => {
      console.log(error);
    });
  }

}
