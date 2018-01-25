import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HomePage} from '../home/home';
import firebase from 'firebase';
import {auth} from 'firebase/app';
import {UserDataService} from '../../services/user-data.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController,
              public userDataService: UserDataService) {
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        console.log('login constructor: ', user);
        userDataService.setUserProfile(user);
        this.navCtrl.push(HomePage);
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
        console.log('google Login Function', token, user);
      }).catch(function(error) {
        console.log(error.message);
      });
    });
  }
}
