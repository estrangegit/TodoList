import { Component } from '@angular/core';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {App} from 'ionic-angular';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(public userDataServiceProvider: UserDataServiceProvider,
              public app: App) {}

  ionViewCanEnter(): boolean {
    let loggedIn = this.userDataServiceProvider.isLoggedIn();
    let disconnectedMode = this.userDataServiceProvider.isDisconnectedMode();
    if(!loggedIn && !disconnectedMode){
      this.app.getRootNav().setRoot(LoginPage);
      return false;
    }else{
      return true;
    }
  }

}
