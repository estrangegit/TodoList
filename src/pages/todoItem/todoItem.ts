import {Component, DoCheck} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {TodoServiceProvider} from '../../services/todo-service';
import {TodoItem, TodoList} from '../model/model';
import {ModalContentPage} from './modal-content';

@Component({
  selector: 'todo-item',
  templateUrl: 'todoitem.html'
})
export class TodoItemPage implements DoCheck{

  list: TodoList;

  constructor(public navCtrl: NavController,
              private todoService: TodoServiceProvider,
              private navParams: NavParams,
              public modalCtrl: ModalController) {
  }

  ngDoCheck(): void{
    this.todoService.getOneTodoList(this.navParams.get('uuid')).subscribe(
      data => {
          this.list = data;
      }
    );
  }

  public deleteItem(todoList:TodoList, todoItem:TodoItem): void{
    this.todoService.deleteTodo(todoList.uuid, todoItem.uuid);
  }

  public toggle(todoList:TodoList, todoItem:TodoItem):void{
    this.todoService.editTodo(todoList.uuid, todoItem);
  }

  public addTodoItem(todoList:TodoList){
    let modal = this.modalCtrl.create(ModalContentPage, {todoList:todoList});
    modal.present();
  }
}
