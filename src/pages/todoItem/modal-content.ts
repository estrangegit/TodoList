import {NavParams, Platform, ViewController} from 'ionic-angular';
import {TodoItem, TodoList} from '../model/model';
import {Component} from '@angular/core';
import {TodoServiceProvider} from '../../providers/todo-service/todo-service';

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
    private todoService: TodoServiceProvider,
  ) {
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
      this.todoService.newTodoItem(this.todoList, this.todoItem);
    else
      this.todoService.editTodoItem(this.todoList, this.todoItem);
    this.dismiss()
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
