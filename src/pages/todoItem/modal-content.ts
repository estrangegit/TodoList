import {NavParams, Platform, ViewController} from 'ionic-angular';
import {TodoItem, TodoList} from '../../model/model';
import {Component} from '@angular/core';
import {DatabaseServiceProvider} from '../../providers/database-service/database-service';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {StorageDataServiceProvider} from '../../providers/storage-data-service/storage-data-service';

@Component({
  templateUrl: 'modal-content.html'
})
export class ModalContentPage {

  todoItem:TodoItem;
  todoList:TodoList;
  newTodoItem: boolean = false;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public databaseServiceProvider: DatabaseServiceProvider,
    public userDataServiceProvider: UserDataServiceProvider,
    public storageDataServiceProvider: StorageDataServiceProvider) {

    this.todoItem = this.params.get('todoItem');
    this.todoList = this.params.get('todoList');

    if(this.todoItem.uuid.length == 0){
      this.newTodoItem = true;
    }
  }

  public cancel(){
    this.dismiss();
  }

  public save(){
    if(this.newTodoItem){
      if(this.userDataServiceProvider.isLoggedIn()){
        this.databaseServiceProvider.newTodoItem(this.todoList, this.todoItem);
      }
      else if(this.userDataServiceProvider.isDisconnectedMode()){
        this.storageDataServiceProvider.newTodoItem(this.todoList, this.todoItem);
      }
    }
    else{
      if(this.userDataServiceProvider.isLoggedIn()){
        this.databaseServiceProvider.editTodoItem(this.todoList, this.todoItem);
      }else if(this.userDataServiceProvider.isDisconnectedMode()){
        this.storageDataServiceProvider.editTodoItem(this.todoList, this.todoItem);
      }
    }
    this.dismiss()
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
