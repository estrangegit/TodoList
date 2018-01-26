import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';
import firebase from 'firebase';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {TabsPage} from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController,
              public userDataServiceProvider: UserDataServiceProvider,
              public app: App) {
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        userDataServiceProvider.setUserProfile(user);
        this.app.getRootNav().setRoot(TabsPage);
      } else {
        userDataServiceProvider.setUserProfile(null);
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
