import { Component } from '@angular/core';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {App, ToastController} from 'ionic-angular';
import {LoginPage} from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(
    public userDataServiceProvider: UserDataServiceProvider,
    public app: App,
    private toastCtrl: ToastController
  ) 
  {

  }

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

  showToast(){
    this.toastCtrl.create({
      message: 'User was added successfully',
      duration: 3000,
      position: 'top'
    }).present();
  }



}
