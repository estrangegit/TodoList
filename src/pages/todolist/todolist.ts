import {Component} from '@angular/core';
import {AlertController, App, ItemSliding, NavController} from 'ionic-angular';
import {TodoItemPage} from '../todoItem/todoItem';
import {TodoList} from '../model/model';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {DatabaseServiceProvider} from '../../providers/database-service/database-service';
import {SpeechRecognition} from '@ionic-native/speech-recognition';
import {options} from '../../config/speechRecognitionConfig';
import {StorageDataServiceProvider} from '../../providers/storage-data-service/storage-data-service';

@Component({
  selector: 'todo-list',
  templateUrl: 'todolist.html'
})
export class TodoListPage {

  items: any[];
  isListening: boolean = false;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public userDataServiceProvider: UserDataServiceProvider,
              public app: App,
              public databaseServiceProvider: DatabaseServiceProvider,
              public storageDataServiceProvider: StorageDataServiceProvider,
              public speechRecognition: SpeechRecognition) {
  }

  ionViewCanEnter(): boolean {
    let loggedIn = this.userDataServiceProvider.isLoggedIn();
    let disconnectedMode = this.userDataServiceProvider.isDisconnectedMode();
    if(!loggedIn && !disconnectedMode){
      return false;
    }else{
      return true;
    }
  }

  ionViewWillEnter(){
    if(this.userDataServiceProvider.isLoggedIn()){
      this.initTodoLists();
    }else if(this.userDataServiceProvider.isDisconnectedMode()){
      this.initTodoListsFromStorage();
    }


// Check if speechRecognition feature is available

    this.speechRecognition.isRecognitionAvailable()
      .then((available: boolean) => {
        available ? console.log('SpeechRecognition available') : console.log('SpeechRecognition unAvailable');
      })
  }

  public addTodoList():void{
    let prompt = this.alertCtrl.create({
      title: 'Nouvelle Todo liste',
      message: "Merci d'entrer le nom de la nouvelle Todo liste",
      inputs: [
        {
          name: 'name',
          placeholder: 'ex:course'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {}
        },
        {
          text: 'Enregistrer',
          handler: data => {
            if(this.userDataServiceProvider.isLoggedIn())
              this.databaseServiceProvider.newTodoList(data.name);
            else if(this.userDataServiceProvider.isDisconnectedMode()){
              this.storageDataServiceProvider.newTodoList(data.name);
            }
          }
        }
      ]
    });
    prompt.present();
  }

  public editTodoList(todolist: TodoList, slidingItem: ItemSliding):void{
    let prompt = this.alertCtrl.create({
      title: 'Edition de la todo liste',
      message: "Précisez le nouveau nom",
      inputs: [
        {
          name: 'name',
          value: todolist.name.toString()
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          handler: data => {
            slidingItem.close();
          }
        },
        {
          text: 'Enregistrer',
          handler: data => {
            if(this.userDataServiceProvider.isLoggedIn()){
              this.databaseServiceProvider.editTodoListName(todolist, data.name);
            }
            else if(this.userDataServiceProvider.isDisconnectedMode()){
              this.storageDataServiceProvider.editTodoListName(todolist, data.name);
              this.initTodoListsFromStorage();
            }
            slidingItem.close();
          }
        }
      ]
    });
    prompt.present();
  }

  public deleteTodoList(todoList: TodoList,  slidingItem: ItemSliding): void{
    let alert = this.alertCtrl.create({
      title: 'Confirmation de la suppression',
      message: 'Voulez-vous supprimer cette liste?',
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
              this.databaseServiceProvider.deleteTodoList(todoList);
            else if(this.userDataServiceProvider.isDisconnectedMode()){
              this.storageDataServiceProvider.deleteTodoList(todoList);
              this.initTodoListsFromStorage();
            }
          }
        }
      ]
    });
    alert.present();
  }

  public itemSelected(uuid): void{
    this.navCtrl.push(TodoItemPage, {
      uuid: uuid
    })
  }

  private initTodoLists(){
    this.databaseServiceProvider.getTodoList().subscribe(
      data => {this.populateItems(data);}
    );
  }

  private initTodoListsFromStorage() {
    this.storageDataServiceProvider.getTodoList().then(
      (data) => {this.populateItems(data)}
    );
  }

  private populateItems(data){
    this.items = [];
    for (let i = 0; i < data.length; i++) {
      let nbUncompletedItems = 0;
      if (data[i].items) {
        for (let j = 0; j < data[i].items.length; j++) {
          if (!data[i].items[j].complete) {
            nbUncompletedItems++;
          }
        }
      }
      this.items.push({list: data[i], nbUncompletedItems: nbUncompletedItems});
    }
  }

  public listenAfterPermissionGranted():void {
    this.speechRecognition.startListening(options)
      .subscribe(
        (matches: Array<string>) => {
            let match = matches[0];
            let firstWord = match.substr(0, match.indexOf(" "));
            let listName = match.substr(match.indexOf(" ")+1);

            if(firstWord.toLowerCase()=='ajouter'){
              listName = listName.charAt(0).toUpperCase() + listName.slice(1);

              if(this.userDataServiceProvider.isLoggedIn()){
                this.databaseServiceProvider.newTodoList(listName);
              }
              else if(this.userDataServiceProvider.isDisconnectedMode()){
                this.storageDataServiceProvider.newTodoList(listName);
                this.initTodoListsFromStorage();
              }
            }else if(firstWord.toLowerCase()=='supprimer'){

              let listNames = [];

              for(let i = 0; i < matches.length; i++){
                listNames.push(matches[i].substr(matches[i].indexOf(" ")+1));
              }

              let abort = false;
              for(let i = 0; i < listNames.length && !abort; i++){
                for(let j = 0; j < this.items.length && !abort; j++){
                  if(listNames[i].toLowerCase()==this.items[j].list.name.toLowerCase()){
                    if(this.userDataServiceProvider.isLoggedIn())
                      this.databaseServiceProvider.deleteTodoList(this.items[j].list);
                    else if(this.userDataServiceProvider.isDisconnectedMode()){
                      this.storageDataServiceProvider.deleteTodoList(this.items[j].list);
                      this.initTodoListsFromStorage();
                    }
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
