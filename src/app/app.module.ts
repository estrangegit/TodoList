import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TodoListPage } from '../pages/todolist/todolist';
import { TodoItemPage } from '../pages/todoItem/todoItem';
import { HomePage } from '../pages/home/home';
import {MapPage} from '../pages/map/map';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TodoDataServiceProvider } from '../providers/todo-data-service/todo-data-service';
import { ModalContentPage } from '../pages/todoItem/modal-content';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { LoginPage } from '../pages/login/login';
import { UserDataServiceProvider } from '../providers/user-data-service/user-data-service';
import { ProfilePage } from '../pages/profile/profile';
import { AngularFireModule } from 'angularfire2';
import { DatabaseServiceProvider } from '../providers/database-service/database-service';
import {SpeechRecognition} from '@ionic-native/speech-recognition';
import {StorageDataServiceProvider} from '../providers/storage-data-service/storage-data-service';
import {IonicStorageModule} from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import {firebaseConfigurationParams} from '../config/firebaseConfig';

export const firebaseConfig = {
  apiKey: firebaseConfigurationParams.apiKey,
  authDomain: firebaseConfigurationParams.authDomain,
  databaseURL: firebaseConfigurationParams.databaseURL,
  projectId: firebaseConfigurationParams.projectId,
  storageBucket: firebaseConfigurationParams.storageBucket,
  messagingSenderId: firebaseConfigurationParams.messagingSenderId
};

@NgModule({
  declarations: [
    MyApp,
    TodoListPage,
    TodoItemPage,
    HomePage,
    TabsPage,
    ModalContentPage,
    LoginPage,
    ProfilePage,
    MapPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TodoListPage,
    TodoItemPage,
    HomePage,
    TabsPage,
    ModalContentPage,
    LoginPage,
    ProfilePage,
    MapPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TodoDataServiceProvider,
    StorageDataServiceProvider,
    UserDataServiceProvider,
    SpeechRecognition,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseServiceProvider
  ]
})
export class AppModule {}
