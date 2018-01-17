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
import {TodoServiceProvider} from '../services/todo-service';
import {ModalContentPage} from '../pages/todoItem/modal-content';

@NgModule({
  declarations: [
    MyApp,
    TodoListPage,
    TodoItemPage,
    HomePage,
    TabsPage,
    ModalContentPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TodoListPage,
    TodoItemPage,
    HomePage,
    TabsPage,
    ModalContentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TodoServiceProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
