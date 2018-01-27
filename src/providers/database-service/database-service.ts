import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {Observable} from "rxjs/Observable";
import {TodoItem, TodoList} from '../../pages/model/model';
import * as firebase from 'firebase/app';

@Injectable()
export class DatabaseServiceProvider {

  private _db: any;
  private _todoRef: any;

  constructor(public afDatabase: AngularFireDatabase) {
    this._db = firebase.database().ref('/');
    this._todoRef = firebase.database().ref('/todolists');
  }

  public getTodoList(): Observable<any[]> {
    return this.afDatabase.list('/todolists').valueChanges();
  }

  public newTodoList(name: String){
    let uuid = this.createUuid();
    let todoList = {"uuid":uuid, name: name, items: false};
    this._todoRef.push(todoList);
  }

  public deleteTodoList(todoList : TodoList) {
    this._todoRef.orderByChild("uuid").equalTo(todoList.uuid).on("value", function(snapshot){
      snapshot.forEach(function(data){
        firebase.database().ref('/todolists').child(data.key).remove();
      })
    });
  }

  public editTodoList(todoList : TodoList, name) {
    todoList.name = name;
  }

  public getOneTodoList(uuid:String){
    let todoList;
    this._todoRef.orderByChild("uuid").equalTo(uuid).once("value", function(snapshot){
      todoList = snapshot.val();
    });
    return todoList;
  }

  public editTodoItem(todoList: TodoList, todoItem: TodoItem) {
    let todoLists;

    this.afDatabase.list('/todolists').valueChanges().subscribe(
      data => {
        todoLists = data;
      }
    );
    console.log(todoLists);
/*
    console.log(this._todoRef);

    this._todoRef.orderByChild("uuid")
        .equalTo(todoList.uuid)
        .once("value", function(snapshot){
      console.log(snapshot.val);
    });
*/
  }

  private createUuid(): String{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
