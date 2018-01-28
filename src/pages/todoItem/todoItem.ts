import {Component, OnInit} from '@angular/core';
import {App, ItemSliding, ModalController, NavController, NavParams} from 'ionic-angular';
import {TodoServiceProvider} from '../../providers/todo-service/todo-service';
import {TodoItem, TodoList} from '../model/model';
import {ModalContentPage} from './modal-content';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {LoginPage} from '../login/login';
import {DatabaseServiceProvider} from '../../providers/database-service/database-service';

@Component({
  selector: 'todo-item',
  templateUrl: 'todoitem.html'
})
export class TodoItemPage implements OnInit{

  public list:any;

  constructor(public navCtrl: NavController,
              private todoService: TodoServiceProvider,
              private navParams: NavParams,
              public modalCtrl: ModalController,
              public userDataServiceProvider: UserDataServiceProvider,
              public app: App,
              public databaseServiceProvider: DatabaseServiceProvider) {}

  ngOnInit(){
    this.databaseServiceProvider.getOneTodoList(this.navParams.get('uuid')).subscribe(
      data => {this.list = data[0]});
  }

  ionViewCanEnter(): boolean {
    let loggedIn = this.userDataServiceProvider.isLoggedIn();
    if(!loggedIn){
      this.app.getRootNav().setRoot(LoginPage);
      return false;
    }else{
      return true;
    }
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

  public toggle(todoList: TodoList, todoItem:TodoItem):void{
        this.databaseServiceProvider.editTodoItem(todoList, todoItem);
  }

  public addTodoItem(todoList:TodoList){
    let todoItem = <TodoItem>{uuid:'', name:'', complete:false};
    let modal = this.modalCtrl.create(ModalContentPage, {todoList:todoList, todoItem:todoItem});
    modal.present();
  }
}
