import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from "rxjs/Observable";
import {TodoList} from '../../pages/model/model';
import * as firebase from 'firebase/app';
import {UserDataServiceProvider} from '../user-data-service/user-data-service';

@Injectable()
export class DatabaseServiceProvider {

  private _todoRef: any;
  private _path: string = '';
  private _todoUserRef: any;
  private _pathUser: string = '';
  private _rootRef: any;
  private _pathRoot: string = '';

  constructor(public afDatabase: AngularFireDatabase,
              public userDataServiceProvider: UserDataServiceProvider) {
    this._pathRoot = '/users';
    this._rootRef = firebase.database().ref('/users');
  }

  public getTodoList(): any {
    return Observable.fromPromise(firebase.database().ref(this._path).once('value').then((data)=>{
      const todoLists =  data.val();
      return firebase.database().ref(this._pathUser).once('value').then((data)=>{
        const Lists = data.val();
        let todoList = [];
        if(Lists != null){
          for(let listId in todoLists){
            if((typeof Lists.own != 'undefined') && (Lists.own.indexOf(todoLists[listId].uuid) !=-1)){
              todoList.push(todoLists[listId]);
            }
            if((typeof  Lists.share != 'undefined') && (Lists.share.indexOf(todoLists[listId].uuid) !=-1)){
              todoList.push(todoLists[listId]);
            }
          }
        }
        return todoList;
      })
    }));
  }

  public newTodoList(name: String){

    let uuid = this.createUuid();
    let todoList = {"uuid":uuid, name: name, items: false};

    this._todoRef.push(todoList);

    firebase.database().ref(this._pathUser).once('value').then((data)=>{
      const Lists = data.val();
      let ownListsTemp = [];
      let shareListsTemp = [];
      if(Lists!=null){
        if(typeof Lists.own != 'undefined')
          ownListsTemp=Lists.own;
        if(typeof  Lists.share != 'undefined')
          shareListsTemp=Lists.share;
      }
      ownListsTemp.push(uuid);
      this._todoUserRef.set({
        own: ownListsTemp,
        share: shareListsTemp,
        email: this.userDataServiceProvider.getUserProfile().providerData[0].email
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
        own: ownLists,
        email: this.userDataServiceProvider.getUserProfile().providerData[0].email
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

  public shareTodoList(todoList, email): Promise<any>{
    return this._rootRef.orderByChild('email')
      .equalTo(email)
      .once("value")
      .then((data) => {

        let message = ''

        if(data.val()==null)
          message = email + ' ne correspond à aucun utilisateur répertorié';

        data.forEach((snapChild) => {

          let ownListsTemp = data.val()[snapChild.key]['own'];
          let shareListsTemp = data.val()[snapChild.key]['share'];

          if(typeof ownListsTemp == 'undefined')
            ownListsTemp = [];
          if(typeof shareListsTemp == 'undefined')
            shareListsTemp = [];

          if(shareListsTemp.indexOf(todoList.uuid) != -1){
            message = 'Cette liste est déjà partagée avec ' + email;
          }else{
            shareListsTemp.push(todoList.uuid);
            message = 'Succès du partage de la liste avec ' + email;
          }

          let pathUser = '/users/' + snapChild.key;
          let userRef = firebase.database().ref(pathUser);

          userRef.set({
            own: ownListsTemp,
            share: shareListsTemp,
            email: email
          });

        });

        return message;
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
