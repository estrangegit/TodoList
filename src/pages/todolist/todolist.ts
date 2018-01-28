import {Component} from '@angular/core';
import {AlertController, App, ItemSliding, NavController} from 'ionic-angular';
import {TodoItemPage} from '../todoItem/todoItem';
import {TodoList} from '../model/model';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {LoginPage} from '../login/login';
import {DatabaseServiceProvider} from '../../providers/database-service/database-service';

@Component({
  selector: 'todo-list',
  templateUrl: 'todolist.html'
})
export class TodoListPage {

  items: any[];

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public userDataServiceProvider: UserDataServiceProvider,
              public app: App,
              public databaseServiceProvider: DatabaseServiceProvider) {}

  ionViewCanEnter(): boolean {
    let loggedIn = this.userDataServiceProvider.isLoggedIn();
    if(!loggedIn){
      this.app.getRootNav().setRoot(LoginPage);
      return false;
    }else{
      return true;
    }
  }

  ionViewWillEnter(){
    this.initTodoLists();
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
            this.databaseServiceProvider.newTodoList(data.name);
            this.initTodoLists();
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
          handler: data => {}
        },
        {
          text: 'Enregistrer',
          handler: data => {
            this.databaseServiceProvider.editTodoListName(todolist, data.name);
            slidingItem.close();
          }
        }
      ]
    });
    prompt.present();
  }

  public deleteTodoList(todoList: TodoList): void{
    this.databaseServiceProvider.deleteTodoList(todoList);
    this.initTodoLists();
  }

  public itemSelected(uuid): void{
    this.navCtrl.push(TodoItemPage, {
      uuid: uuid
    })
  }

  private initTodoLists(){
    this.databaseServiceProvider.getTodoList().subscribe(
      data => {
        this.items = [];
        for(let i = 0; i < data.length; i++){
          let nbUncompletedItems = 0;
          if(data[i].items){
            for(let j = 0; j < data[i].items.length; j++){
              if(!data[i].items[j].complete){
                nbUncompletedItems++;
              }
            }
          }
          this.items.push({list: data[i], nbUncompletedItems: nbUncompletedItems});
        }
      }
    );
  }
}
