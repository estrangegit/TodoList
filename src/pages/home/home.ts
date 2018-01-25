import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {TabsPage} from '../tabs/tabs';
import {UserDataService} from '../../services/user-data.service';
import {auth} from 'firebase/app';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public navCtrl: NavController,
              public userDataService: UserDataService) {

    this.navCtrl.setRoot(TabsPage);
    console.log(userDataService.getUserProfile());
  }

  public googleLogout():void {
    auth().signOut().then(()=>{
      console.log('user signed out successfully');
      this.navCtrl.setRoot(LoginPage);
    }, error => {
      console.log(error);
    });
  }
}
