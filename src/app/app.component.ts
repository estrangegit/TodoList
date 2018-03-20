import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase/app';
import {LoginPage} from '../pages/login/login';
import {firebaseConfigurationParams} from '../config/firebaseConfig';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    firebase.initializeApp({
      apiKey: firebaseConfigurationParams.apiKey,
      authDomain: firebaseConfigurationParams.authDomain,
      databaseURL: firebaseConfigurationParams.databaseURL,
      projectId: firebaseConfigurationParams.projectId,
      storageBucket: firebaseConfigurationParams.storageBucket,
      messagingSenderId: firebaseConfigurationParams.messagingSenderId
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });
  }
}
