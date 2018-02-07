import {Component} from '@angular/core';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {LoginPage} from '../login/login';
import {App} from 'ionic-angular';
import {auth} from 'firebase/app';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

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

  public googleLogout():void {
    auth().signOut().then(()=>{
      this.app.getRootNav().setRoot(LoginPage);
      console.log('user logged out');
    }, error => {
      console.log(error);
    });
  }

  public connectedMode():void {
    this.userDataServiceProvider.setDisconnectedMode(false);
    this.app.getRootNav().setRoot(LoginPage);
  }
}
