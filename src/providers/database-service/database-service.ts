import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Observable} from "rxjs/Observable";
import {TodoList} from '../../model/model';
import * as firebase from 'firebase/app';
import {UserDataServiceProvider} from '../user-data-service/user-data-service';
import {Geolocation} from '@ionic-native/geolocation';

@Injectable()
export class DatabaseServiceProvider {

  private _todoRef: any;
  private _path: string = '';
  private _todoUserRef: any;
  private _pathUser: string = '';
  private _rootRef: any;
  private _pathRoot: string = '';

  constructor(public afDatabase: AngularFireDatabase,
              public geolocation: Geolocation,
              public userDataServiceProvider: UserDataServiceProvider) {
    this._pathRoot = '/users';
    this._rootRef = firebase.database().ref('/users');
  }

  public getTodoList(): any {
    firebase.database().ref(this._path).once('value').then((data)=>{
      const todoLists =  data.val();
      firebase.database().ref(this._pathUser).once('value').then((data)=>{
        const Lists = data.val();

        //Permet d'enlever les listes utilisateurs qui n'existent plus
        let tempAllTodoUuid = [];

        for(let listId in todoLists){
          tempAllTodoUuid.push(todoLists[listId].uuid);
        }

        let ownLists =  [];
        let shareLists = [];

        if(Lists != null){
          if(typeof Lists.own != 'undefined')
            ownLists = Lists.own;

          if(typeof Lists.share != 'undefined')
            shareLists = Lists.share;
        }

        ownLists = ownLists.filter((uuid)=>{
          return tempAllTodoUuid.indexOf(uuid)!=-1
        });

        shareLists = shareLists.filter((uuid)=>{
          return (tempAllTodoUuid.indexOf(uuid)!=-1)
        });

        //Corrige les listes présentent en base de données
        this._todoUserRef.set({
          own: ownLists,
          share: shareLists,
          email: this.userDataServiceProvider.getUserProfile().providerData[0].email
        });
      })
    });

    //Récupère l'ensemble des listes des utilisateurs et écoute les modifications sur celles-ci
    return this.afDatabase.list(this._path).valueChanges().map((data) => {
      const todoLists =  data;

      return Observable.combineLatest(this.afDatabase.list(this._pathUser + '/own', ).valueChanges().map((data) => {

        let ownLists =  data;
        let todoList = [];

        //Récupère les listes dont l'utilisateur est propriétaire
        for(let listId in todoLists){
          if(ownLists.indexOf(todoLists[listId]['uuid']) !=-1){
            todoList.push(todoLists[listId]);
          }
        }

        return todoList;
      }),
        this.afDatabase.list(this._pathUser + '/share', ).valueChanges().map((data) => {

          let shareLists =  data;
          let todoList = [];

          //Récupère les listes qui sont partagées avec l'utilisateur
          for(let listId in todoLists){
            if(shareLists.indexOf(todoLists[listId]['uuid']) !=-1){
              todoList.push(todoLists[listId]);
            }
          }

          return todoList;
        }));
    });
  }

  public newTodoList(name: String){

    let uuid = this.createUuid();

    this.geolocation.getCurrentPosition().then((position) => {

      const positionTemp = {latitude: position.coords.latitude, longitude: position.coords.longitude};

      let todoList = {"uuid":uuid, name: name, items: false, position: positionTemp};

      this._todoRef.push(todoList).then(()=>
      {
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
            email: this.userDataServiceProvider.getUserProfile().providerData[0].email,
          });
        })
      });
    });
  }

  public deleteTodoList(todoList : TodoList) {
    firebase.database().ref(this._pathUser).once('value').then((data)=>{
      let ownLists =  [];
      let shareLists = [];

      if(typeof data.val().own != 'undefined')
        ownLists = data.val().own;

      if(typeof data.val().share != 'undefined')
        shareLists = data.val().share;

      const ownIndex = ownLists.indexOf(todoList.uuid);
      const shareIndex = shareLists.indexOf(todoList.uuid);

      if(ownIndex != -1){
        ownLists.splice(ownIndex,1);
      }
      if(shareIndex != -1){
        shareLists.splice(shareIndex,1);
      }

      this._todoUserRef.set({
        own: ownLists,
        share: shareLists,
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
            items: todoList.items,
            position: todoList.position
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
          }else if(ownListsTemp.indexOf(todoList.uuid) != -1){
            message = email + ' est déjà propriétaire de cette liste';
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

  public createUuid(): String{
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

  uploadImage(imageString, todoListUuid, todoItemUuid) : Promise<any>
  {
    let image : string  = 'picture-' + todoListUuid + '-' + todoItemUuid + '.jpg';
    let storageRef : any;
    let parseUpload : any;

    storageRef = firebase.storage().ref('pictures/' + image);
    parseUpload = storageRef.putString(imageString, 'data_url');

    return new Promise((resolve, reject) =>
    {
      storageRef = firebase.storage().ref('pictures/' + image);
      parseUpload = storageRef.putString(imageString, 'data_url');

      parseUpload.on('state_changed', (_snapshot) =>
        {},
        (_err) =>
        {
          reject(_err);
        },
        (success) =>
        {
          resolve(parseUpload.snapshot);
        });
    });
  }

  deletePicture(todoListUuid, todoItemUuid) : Promise<any>{
    let image : string  = 'picture-' + todoListUuid + '-' + todoItemUuid + '.jpg';
    let storageRef : any;

    storageRef = firebase.storage().ref('pictures/' + image);
    return storageRef.delete();
  }
}
