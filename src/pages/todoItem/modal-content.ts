import {NavParams, Platform, ViewController} from 'ionic-angular';
import {TodoItem, TodoList} from '../model/model';
import {Component} from '@angular/core';
import {DatabaseServiceProvider} from '../../providers/database-service/database-service';

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
    public databaseServiceProvider: DatabaseServiceProvider) {

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
    if(this.newTodoItem)
      this.databaseServiceProvider.newTodoItem(this.todoList, this.todoItem);
    else
      this.databaseServiceProvider.editTodoItem(this.todoList, this.todoItem);
    this.dismiss()
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
