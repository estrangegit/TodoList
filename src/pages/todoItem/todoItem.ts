import {Component, DoCheck} from '@angular/core';
import {ItemSliding, ModalController, NavController, NavParams} from 'ionic-angular';
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

  public deleteTodoItem(todoList:TodoList, todoItem:TodoItem): void{
    this.todoService.deleteTodoItem(todoList, todoItem);
  }

  public editTodoItem(todoList:TodoList, todoItem:TodoItem, slidingItem: ItemSliding): void{
    let todoItemTemp = <TodoItem>{uuid:todoItem.uuid, name:todoItem.name, complete:todoItem.complete};
    let modal = this.modalCtrl.create(ModalContentPage, {todoList:todoList, todoItem:todoItemTemp});
    modal.present();

    slidingItem.close();
  }

  public toggle(todoList:TodoList, todoItem:TodoItem):void{
    this.todoService.editTodoItem(todoList, todoItem);
  }

  public addTodoItem(todoList:TodoList){
    let todoItem = <TodoItem>{uuid:'', name:'', complete:false};
    let modal = this.modalCtrl.create(ModalContentPage, {todoList:todoList, todoItem:todoItem});
    modal.present();
  }


}
