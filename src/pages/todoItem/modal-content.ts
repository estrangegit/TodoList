import {NavParams, Platform, ViewController} from 'ionic-angular';
import {TodoItem, TodoList} from '../model/model';
import {Component} from '@angular/core';
import {TodoServiceProvider} from '../../services/todo-service';

@Component({
  templateUrl: 'modal-content.html'
})
export class ModalContentPage {

  todoItem:TodoItem;
  todoList:TodoList;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    private todoService: TodoServiceProvider,
  ) {
    this.todoItem = <TodoItem>{uuid:'', name:'', complete:false};
    this.todoList = this.params.get('todoList')
  }

  public cancel(){
    this.dismiss();
  }

  public save(){
    console.log(this.todoList);
    console.log(this.todoItem);
    this.todoService.newTodoItem(this.todoList, this.todoItem);
    this.dismiss()
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
