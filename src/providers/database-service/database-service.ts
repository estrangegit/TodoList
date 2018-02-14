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

  public getTodoList(): any {
    return Observable.fromPromise(firebase.database().ref(this._path).once('value').then((data)=>{
      const todoLists =  data.val();
      return firebase.database().ref(this._pathUser).once('value').then((data)=>{
        const ownList = data.val();
        let ownTodoList = [];
        for(let listId in todoLists){
          if(ownList.own.indexOf(todoLists[listId].uuid) !=-1 ){
            ownTodoList.push(todoLists[listId]);
          }
        }
        return ownTodoList;
      })
    }));
  }

  public newTodoList(name: String){
    let uuid = this.createUuid();
    let todoList = {"uuid":uuid, name: name, items: false};
    this._todoRef.push(todoList);
    firebase.database().ref(this._pathUser + '/own').once('value').then((snapshot)=>{
      const ownLists =  snapshot.val();
      let ownListsTemp = [];
      if(ownLists!=null){
        ownListsTemp=ownLists
      }
      ownListsTemp.push(uuid);
      this._todoUserRef.set({
        own: ownListsTemp
      })
    })
  }

  public deleteTodoList(todoList : TodoList) {
    firebase.database().ref(this._pathUser).once('value').then((data)=>{
      const ownLists =  data.val().own;
      const index = ownLists.indexOf(todoList.uuid);
      if(index != -1){
        ownLists.splice(index,1);
      }
      this._todoUserRef.set({
        own: ownLists
      })
    });

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

  public editTodoList(todoList){
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
