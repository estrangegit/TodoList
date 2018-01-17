import {Component, OnInit} from '@angular/core';
import { NavController } from 'ionic-angular';
import {TodoServiceProvider} from '../services/todo-service';
import {TodoItemPage} from '../todoItem/todoItem';

@Component({
  selector: 'todo-list',
  templateUrl: 'todolist.html'
})
export class TodoListPage implements OnInit{

  items: any[];

  ngOnInit(): void{
    this.todoService.getList().subscribe(
      data => {

        this.items = [];

        for(let i = 0; i < data.length; i++){
          let nbUncompletedItems = 0;

          for(let j = 0; j < data[i].items.length; j++){
            if(!data[i].items[j].complete){
              nbUncompletedItems++;
            }
          }

          this.items.push({list: data[i], nbUncompletedItems: nbUncompletedItems});

        }
      }
    );
  }

  constructor(public navCtrl: NavController,
              private todoService: TodoServiceProvider) {

  }

  public itemSelected(uuid): void{
    this.navCtrl.push(TodoItemPage, {
      uuid: uuid
    })
  }
}
