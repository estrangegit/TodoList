import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {LoginPage} from '../pages/login/login';
import * as firebase from 'firebase/app';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {

    firebase.initializeApp({
      apiKey: "AIzaSyD8fYOyuvGQVJhyY4mN_QAUPIy8IyMPk44",
      authDomain: "todolist-7301c.firebaseapp.com",
      databaseURL: "https://todolist-7301c.firebaseio.com",
      projectId: "todolist-7301c",
      storageBucket: "todolist-7301c.appspot.com",
      messagingSenderId: "724673715119"
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

    });
  }
}
