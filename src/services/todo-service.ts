import { Injectable } from '@angular/core';
import {TodoItem, TodoList} from "../pages/model/model";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';


@Injectable()
export class TodoServiceProvider {

  data:TodoList[] = [
    {
      uuid : "a351e558-29ce-4689-943c-c3e97be0df8b",
      name : "Liste de courses",
      items : [
        {
          uuid : "7dc94eb4-d4e9-441b-b06b-0ca29738c8d2",
          name : "Acheter du sel",
          complete : false
        },
        {
          uuid : "20c09bdd-1cf8-43b0-9111-977fc4d343bc",
          name : "Acheter des pates",
          complete : false
        },
        {
          uuid : "bef88351-f4f1-4b6a-965d-bb1a4fa3b444",
          name : "Acheter du pain",
          complete : true
        }
      ]
    },
    { uuid : "90c04913-c1a2-47e5-9535-c7a430cdcf9c",
      name : "Idées concert",
      items : [
        {
          uuid : "72849f5f-2ef6-444b-98b0-b50fc019f97c",
          name : "Concert de Pop",
          complete : false
        },
        {
          uuid : "80d4cbbe-1c64-4603-8d00-ee4932045333",
          name : "Concert de rock",
          complete : true
        },
        {
          uuid : "a1cd4568-590b-428b-989d-165f22365485",
          name : "Concert de rap",
          complete : true
        }
      ]
    }
  ];

  constructor() {

  }

  public getTodoList(): Observable<TodoList[]> {
    return Observable.of(this.data);
  }

  public getOneTodoList(uuid:String) : Observable<TodoList> {
    return Observable.of(this.data.find(d => d.uuid == uuid))
  }

  public getTodos(uuid:String) : Observable<TodoItem[]> {
    return Observable.of(this.data.find(d => d.uuid == uuid).items)
  }

  public newTodoItem(todoList: TodoList, todoItem: TodoItem){
    let items = this.data.find(d => d.uuid == todoList.uuid).items;
    todoItem.uuid = this.createUuid();
    items.push(todoItem);
  }

  public editTodoItem(todoList : TodoList, todoItem: TodoItem) {
    let items = this.data.find(d => d.uuid == todoList.uuid).items;
    let index = items.findIndex(value => value.uuid == todoItem.uuid);
    items[index] = todoItem;
  }

  public deleteTodoItem(todoList : TodoList, todoItem: TodoItem) {
    let items = this.data.find(d => d.uuid == todoList.uuid).items;
    let index = items.findIndex(value => value.uuid == todoItem.uuid);
    if (index != -1) {
      items.splice(index, 1);
    }
  }

  public newTodoList(name: String){
    let uuid = this.createUuid();
    let todoList = <TodoList>{uuid:uuid, name: name, items: []};
    this.data.push(todoList);
  }

  public deleteTodoList(todoList : TodoList) {
    let index = this.data.findIndex(d => d.uuid == todoList.uuid);
    if (index != -1) {
      this.data.splice(index, 1);
    }
  }

  public editTodoList(todoList : TodoList) {
    let index = this.data.findIndex(d => d.uuid == todoList.uuid);
    this.data[index] = todoList;
  }

  private createUuid(): String{
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

}
