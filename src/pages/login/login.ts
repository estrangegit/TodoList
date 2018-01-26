import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import firebase from 'firebase';
import {UserDataService} from '../../services/user-data.service';
import {TabsPage} from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController,
              public userDataService: UserDataService,
              public app: App) {
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        userDataService.setUserProfile(user);
        this.app.getRootNav().setRoot(TabsPage);
      } else {
        userDataService.setUserProfile(null);
      }
    });
  }

  public googleLogin():void {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then( () => {
      firebase.auth().getRedirectResult().then( result => {
        let token = result.credential.accessToken;
        let user = result.user;
      }).catch(function(error) {
        console.log(error.message);
      });
    });
  }
}
