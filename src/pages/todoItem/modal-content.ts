import {NavParams, Platform, ViewController} from 'ionic-angular';
import {TodoItem, TodoList} from '../../model/model';
import {Component} from '@angular/core';
import {DatabaseServiceProvider} from '../../providers/database-service/database-service';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {StorageDataServiceProvider} from '../../providers/storage-data-service/storage-data-service';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  templateUrl: 'modal-content.html'
})
export class ModalContentPage {

  todoItem:TodoItem;
  todoList:TodoList;
  newTodoItem: boolean = false;
  captureDataUrl: string;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public databaseServiceProvider: DatabaseServiceProvider,
    public userDataServiceProvider: UserDataServiceProvider,
    public storageDataServiceProvider: StorageDataServiceProvider,
    private camera: Camera
  ) {

    this.todoItem = this.params.get('todoItem');
    this.todoList = this.params.get('todoList');

    if(this.todoItem.uuid.length == 0){
      this.newTodoItem = true;
    }
  }

  public cancel(){
    this.dismiss();
  }

  public save(){
    if(this.captureDataUrl){
      this.todoItem.imgDataUrl = this.captureDataUrl;
    }
    if(this.newTodoItem){
      if(this.userDataServiceProvider.isLoggedIn()){
        this.databaseServiceProvider.newTodoItem(this.todoList, this.todoItem);
      }
      else if(this.userDataServiceProvider.isDisconnectedMode()){
        this.storageDataServiceProvider.newTodoItem(this.todoList, this.todoItem);
      }
    }
    else{
      if(this.userDataServiceProvider.isLoggedIn()){
        this.databaseServiceProvider.editTodoItem(this.todoList, this.todoItem);
      }else if(this.userDataServiceProvider.isDisconnectedMode()){
        this.storageDataServiceProvider.editTodoItem(this.todoList, this.todoItem);
      }
    }
    this.dismiss()
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  takePicture(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => 
    {
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      console.error('image pas prise'+ err);
    });
  }
}
