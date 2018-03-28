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
  captureDataUrl: String = "";
  pictureDeleted: boolean = false;

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
      this.todoItem.uuid = this.databaseServiceProvider.createUuid();
    }

    if(this.todoItem.imgDataUrl)
      this.captureDataUrl = this.todoItem.imgDataUrl;
  }

  public cancel(){
    this.dismiss();
  }

  public save(){
    if(this.newTodoItem){
      if(this.userDataServiceProvider.isLoggedIn()){
        if(this.captureDataUrl){
          this.databaseServiceProvider.uploadImage(this.captureDataUrl,
            this.todoList.uuid,
            this.todoItem.uuid)
            .then((snapshot)=>{
              this.todoItem.imgDataUrl = snapshot.downloadURL;
              this.databaseServiceProvider.newTodoItem(this.todoList, this.todoItem);
            });
        }else{
          this.databaseServiceProvider.newTodoItem(this.todoList, this.todoItem);
        }
      }
      else if(this.userDataServiceProvider.isDisconnectedMode()){
        this.todoItem.imgDataUrl = this.captureDataUrl;
        this.storageDataServiceProvider.newTodoItem(this.todoList, this.todoItem);
      }
    }else{
      if(this.userDataServiceProvider.isLoggedIn()){
        if(this.captureDataUrl){
          this.databaseServiceProvider.uploadImage(this.captureDataUrl,
            this.todoList.uuid,
            this.todoItem.uuid)
            .then((snapshot)=>{
              this.todoItem.imgDataUrl = snapshot.downloadURL;
              this.databaseServiceProvider.editTodoItem(this.todoList, this.todoItem);
            });
        }else{
          if(this.pictureDeleted){
            this.databaseServiceProvider.deletePicture(this.todoList.uuid, this.todoItem.uuid)
              .then(()=>{
                this.todoItem.imgDataUrl = "";
                this.databaseServiceProvider.editTodoItem(this.todoList, this.todoItem);
              });
          }else{
            this.databaseServiceProvider.editTodoItem(this.todoList, this.todoItem);
          }
        }
      }else if(this.userDataServiceProvider.isDisconnectedMode()){
        this.todoItem.imgDataUrl = this.captureDataUrl;
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
      targetWidth: 320,
      targetHeight: 240,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then((imageData) =>
    {
      this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      console.error(err);
    });
  }

  deletePicture(){
    this.pictureDeleted = true;
    this.captureDataUrl = "";
  }
}
