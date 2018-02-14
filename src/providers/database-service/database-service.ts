import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from "rxjs/Observable";
import {TodoList} from '../../pages/model/model';
import * as firebase from 'firebase/app';

@Injectable()
export class DatabaseServiceProvider {

  private _todoRef: any;
  private _path: string = '';
  private _todoUserRef: any;
  private _pathUser: string = '';

  constructor(public afDatabase: AngularFireDatabase) {}

  public getTodoList(): Observable<any[]> {
    return this.afDatabase.list(this._path).valueChanges();
  }

  public newTodoList(name: String){
    let uuid = this.createUuid();
    let todoList = {"uuid":uuid, name: name, items: false};

    this._todoRef.push(todoList);

    firebase.database().ref(this._pathUser + '/own').once('value').then((snapshot)=>{
      let data =  snapshot.val();
      let ownLists = [];
      if(data!=null){
        ownLists=data
      }
      ownLists.push(uuid);
      this._todoUserRef.set({
        own: ownLists
      })
    })
  }

  public deleteTodoList(todoList : TodoList) {
    this._todoRef
      .orderByChild("uuid")
      .equalTo(todoList.uuid)
      .once("value")
      .then(function(snapshot){
        snapshot.forEach(function(snapChild) {
          snapChild.ref.set(null);
        });
      })
  }

  public editTodoListName(todoList, name) {
    todoList.name = name;
    this.editTodoList(todoList);
  }

  public getOneTodoList(uuid){
    return this.afDatabase.list(this._path, ref => ref.orderByChild('uuid').equalTo(uuid)).valueChanges();
  }

  public editTodoList(todoList) {
    this._todoRef
      .orderByChild("uuid")
      .equalTo(todoList.uuid)
      .once("value")
      .then(function(snapshot){
        snapshot.forEach(function(snapChild) {
          snapChild.ref.set({
            name: todoList.name,
            uuid: todoList.uuid,
            items: todoList.items
          });
        });
      })
  }

  public newTodoItem(todoList, todoItem){

    todoItem.uuid = this.createUuid();

    if(todoList.items == false){
      todoList.items = [];
    }

    todoList.items.push(todoItem);
    this.editTodoList(todoList);

  }

  public editTodoItem(todoList, todoItem){
    let index = todoList.items.findIndex(value => value.uuid == todoItem.uuid);
    todoList.items[index] = todoItem;
    this.editTodoList(todoList);
  }

  public deleteTodoItem(todoList, todoItem) {
    let index = todoList.items.findIndex(value => value.uuid == todoItem.uuid);
    if (index != -1) {
      if(todoList.items.length > 1)
        todoList.items.splice(index, 1);
      else
        todoList.items = false;
    }
    this.editTodoList(todoList);
  }

  private createUuid(): String{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public initPath(uid:string){
    this._path = '/lists';
    this._pathUser = '/users/' + uid;
  }

  public initTodoRef(uid:string){
    let path = '/lists';
    let pathUser = '/users/' + uid;
    this._todoRef = firebase.database().ref(path);
    this._todoUserRef = firebase.database().ref(pathUser);
  }

}
