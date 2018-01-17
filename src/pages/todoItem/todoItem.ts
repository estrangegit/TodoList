import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {TodoServiceProvider} from '../services/todo-service';
import {TodoList} from '../model/model';

@Component({
  selector: 'todo-item',
  templateUrl: 'todoitem.html'
})
export class TodoItemPage implements OnInit{

  list: TodoList;

  constructor(public navCtrl: NavController,
              private todoService: TodoServiceProvider,
              private navParams: NavParams) {
  }

  ngOnInit(): void{
    this.todoService.getOneList(this.navParams.get('uuid')).subscribe(
      data => {
          this.list = data;
      }
    );
  }

  public deleteItem(uuid): void{
    console.log(uuid);
  }

}
