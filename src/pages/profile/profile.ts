import {Component} from '@angular/core';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {LoginPage} from '../login/login';
import {App} from 'ionic-angular';
import {auth} from 'firebase/app';
import {TabsPage} from '../tabs/tabs';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  constructor(public userDataServiceProvider: UserDataServiceProvider,
              public app: App) {}
/*
  public logInfos(){
    console.log(this.userDataServiceProvider.getUserProfile());
  }
*/

  ionViewCanEnter(): boolean {
    let loggedIn = this.userDataServiceProvider.isLoggedIn();
    if(!loggedIn){
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
}
