import {Component, OnInit} from '@angular/core';
import {AlertController, App, ItemSliding, ModalController, NavController, NavParams} from 'ionic-angular';
import {TodoItem, TodoList} from '../model/model';
import {ModalContentPage} from './modal-content';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {LoginPage} from '../login/login';
import {DatabaseServiceProvider} from '../../providers/database-service/database-service';
import {SpeechRecognition} from '@ionic-native/speech-recognition';
import {options} from '../../config/speechRecognitionConfig';
import {StorageDataServiceProvider} from '../../providers/storage-data-service/storage-data-service';

@Component({
  selector: 'todo-item',
  templateUrl: 'todoItem.html'
})
export class TodoItemPage implements OnInit{

  public list:any;

  constructor(public navCtrl: NavController,
              private navParams: NavParams,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              public userDataServiceProvider: UserDataServiceProvider,
              public app: App,
              public databaseServiceProvider: DatabaseServiceProvider,
              public storageDataServiceProvider: StorageDataServiceProvider,
              public speechRecognition: SpeechRecognition) {}



  ngOnInit(){
    if(this.userDataServiceProvider.isLoggedIn()){
      this.databaseServiceProvider.getOneTodoList(this.navParams.get('uuid')).subscribe(
        data => {this.list = data[0]});
    }else if(this.userDataServiceProvider.isDisconnectedMode()){
        this.initTodoItemsFromStorage();
    }
  }

  ionViewCanEnter(): boolean {
    let loggedIn = this.userDataServiceProvider.isLoggedIn();
    let disconnectedMode = this.userDataServiceProvider.isDisconnectedMode();
    if(!loggedIn && !disconnectedMode){
      this.app.getRootNav().setRoot(LoginPage);
      return false;
    }else{
      return true;
    }
  }

  public deleteTodoItem(todoList:TodoList, todoItem:TodoItem, slidingItem: ItemSliding): void{
    let alert = this.alertCtrl.create({
      title: 'Confirmation de la suppression',
      message: 'Voulez-vous supprimer cet item?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            slidingItem.close();
          }
        },
        {
          text: 'Confirmer',
          handler: () => {
            if(this.userDataServiceProvider.isLoggedIn())
              this.databaseServiceProvider.deleteTodoItem(todoList, todoItem);
            else if(this.userDataServiceProvider.isDisconnectedMode())
              this.storageDataServiceProvider.deleteTodoItem(todoList, todoItem);
          }
        }
      ]
    });
    alert.present();
  }

  public editTodoItem(todoList:TodoList, todoItem:TodoItem, slidingItem: ItemSliding): void{
    let todoItemTemp = <TodoItem>{uuid:todoItem.uuid, name:todoItem.name, complete:todoItem.complete};
    let modal = this.modalCtrl.create(ModalContentPage, {todoList:todoList, todoItem:todoItemTemp});
    modal.present();

    slidingItem.close();
  }

  public toggle(todoList):void{
    if(this.userDataServiceProvider.isLoggedIn())
      this.databaseServiceProvider.editTodoList(todoList);
    else if(this.userDataServiceProvider.isDisconnectedMode()){
      this.storageDataServiceProvider.editTodoList(todoList);
    }
  }

  public addTodoItem(todoList:TodoList){
    let todoItem = <TodoItem>{uuid:'', name:'', complete:false};
    let modal = this.modalCtrl.create(ModalContentPage, {todoList:todoList, todoItem:todoItem});
    modal.present();
  }

  private initTodoItemsFromStorage() {
    this.storageDataServiceProvider.getOneTodoList(this.navParams.get('uuid'))
                                    .then((list)=>{this.list = list});
  }

  public listenAfterPermissionGranted():void {
    this.speechRecognition.startListening(options)
      .subscribe(
        (matches: Array<string>) => {
          let match = matches[0];
          let firstWord = match.substr(0, match.indexOf(" "));
          let itemName = match.substr(match.indexOf(" ")+1);

          if(firstWord.toLowerCase()=='ajouter'){
            itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
            let todoItem = <TodoItem>{uuid:'', name:itemName, complete:false};

            if(this.userDataServiceProvider.isLoggedIn()){
              this.databaseServiceProvider.newTodoItem(this.list, todoItem);
            }else if(this.userDataServiceProvider.isDisconnectedMode()){
              this.storageDataServiceProvider.newTodoItem(this.list, todoItem);
            }

          }else if(firstWord.toLowerCase()=='supprimer'){
            let itemNames = [];

            for(let i = 0; i < matches.length; i++){
              itemNames.push(matches[i].substr(matches[i].indexOf(" ")+1));
            }
            let abort = false;
            for(let i = 0; i < itemNames.length && !abort; i++){
              for(let j = 0; j < this.list.items.length && !abort; j++){
                if(itemNames[i].toLowerCase()==this.list.items[j].name.toLowerCase()){
                  if(this.userDataServiceProvider.isLoggedIn())
                    this.databaseServiceProvider.deleteTodoItem(this.list, this.list.items[j]);
                  else if(this.userDataServiceProvider.isDisconnectedMode())
                    this.storageDataServiceProvider.deleteTodoItem(this.list, this.list.items[j]);
                  abort = true;
                }
              }
            }
          }
        },
        (onerror) => console.log('error:', onerror)
      )
  }

  public listen(): void {
    this.speechRecognition.requestPermission()
      .then(
        () => {console.log('Speech permission granted'); this.listenAfterPermissionGranted()},
        () => {console.log('Speech permission denied')}
      )
  }

}
