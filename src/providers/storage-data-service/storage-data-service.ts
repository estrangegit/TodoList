import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';
import 'rxjs/Rx';
import {Geolocation} from '@ionic-native/geolocation';


@Injectable()
export class StorageDataServiceProvider {

  constructor(private storage: Storage,
              public geolocation: Geolocation) {}

  public getTodoList(): Promise<any[]> {
    let todoLists = [];
    return this.storage.forEach( (value, key, index) => {
      todoLists.push(value);
    }).then(()=>{return todoLists});
  }

  public newTodoList(name: String){
    return this.geolocation.getCurrentPosition().then((position) => {
      const positionTemp = {latitude: position.coords.latitude, longitude: position.coords.longitude};
      let uuid = this.createUuid();
      let todoList = {"uuid":uuid, name: name, items: [], position: positionTemp};
      return this.storage.set(uuid, todoList);
    });
  }

  public deleteTodoList(todoList){
    this.storage.remove(todoList.uuid);
  }

  public editTodoListName(todoList, name) {
    todoList.name = name;
    this.storage.set(todoList.uuid, todoList);
  }

  public editTodoList(todoList) {
    this.storage.set(todoList.uuid, todoList);
  }

  public getOneTodoList(uuid){
    return this.storage.get(uuid);
  }

  public newTodoItem(todoList, todoItem){
    todoItem.uuid = this.createUuid();
    todoList.items.push(todoItem);
    this.storage.set(todoList.uuid, todoList);
  }

  public editTodoItem(todoList, todoItem){
    let index = todoList.items.findIndex(value => value.uuid == todoItem.uuid);
    todoList.items[index] = todoItem;
    this.editTodoList(todoList);
  }

  public deleteTodoItem(todoList, todoItem) {
    let index = todoList.items.findIndex(value => value.uuid == todoItem.uuid);
    if (index != -1) {
      todoList.items.splice(index, 1);
    }
    this.editTodoList(todoList);
  }

  private createUuid(): string{
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
}
