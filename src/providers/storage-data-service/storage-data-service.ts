import { Injectable } from '@angular/core';
import {TodoItem, TodoList} from "../../pages/model/model";
import {Observable} from "rxjs/Observable";
import {Storage} from '@ionic/storage';
import 'rxjs/Rx';


@Injectable()
export class StorageDataServiceProvider {

  constructor(private storage: Storage) {}

  public getTodoList(): Promise<any[]> {
    let todoLists = [];
    return this.storage.forEach( (value, key, index) => {
      todoLists.push(value);
    }).then(()=>{return todoLists});
  }

  public newTodoList(name: String){
    let uuid = this.createUuid();
    let todoList = {"uuid":uuid, name: name, items: []};
    this.storage.set(uuid, todoList);
  }

  public deleteTodoList(todoList){
    this.storage.remove(todoList.uuid);
  }

  public editTodoListName(todoList, name) {
    todoList.name = name;
    this.storage.set(todoList.uuid, todoList);
  }

  private createUuid(): string{
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
}
