import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TodoListPage } from '../pages/todolist/todolist';
import { TodoItemPage } from '../pages/todoItem/todoItem';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TodoServiceProvider } from '../providers/todo-service/todo-service';
import { ModalContentPage } from '../pages/todoItem/modal-content';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { LoginPage } from '../pages/login/login';
import { UserDataServiceProvider } from '../providers/user-data-service/user-data-service';
import { ProfilePage } from '../pages/profile/profile';

@NgModule({
  declarations: [
    MyApp,
    TodoListPage,
    TodoItemPage,
    HomePage,
    TabsPage,
    ModalContentPage,
    LoginPage,
    ProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
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
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TodoServiceProvider,
    UserDataServiceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
