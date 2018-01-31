import { Component } from '@angular/core';
import {TabsPage} from '../tabs/tabs';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import { App } from 'ionic-angular';
import firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  todoLists: any;

  constructor(public userDataServiceProvider: UserDataServiceProvider,
              public app: App) {
/*
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        this.userDataServiceProvider.setUserProfile(user);
        this.userDataServiceProvider.setLoggedIn(true);
        this.app.getRootNav().setRoot(TabsPage);
      } else {
        this.userDataServiceProvider.setUserProfile(null);
        this.userDataServiceProvider.setLoggedIn(false);
      }
    });
*/
  }

  public googleLogin():void {

    this.app.getRootNav().setRoot(TabsPage);
/*
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then( () => {
      firebase.auth().getRedirectResult().then( result => {
        let token = result.credential.accessToken;
        let user = result.user;
        console.log(token, user);
      }).catch(function(error) {
        console.log(error.message);
      });
    });
*/
  }
}
