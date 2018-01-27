import {Component} from '@angular/core';
import {AlertController, App, NavController} from 'ionic-angular';
import {TodoServiceProvider} from '../../providers/todo-service/todo-service';
import {TodoItemPage} from '../todoItem/todoItem';
import {TodoList} from '../model/model';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import {LoginPage} from '../login/login';

@Component({
  selector: 'todo-list',
  templateUrl: 'todolist.html'
})
export class TodoListPage {

  items: any[];

  constructor(public navCtrl: NavController,
              private todoService: TodoServiceProvider,
              public alertCtrl: AlertController,
              public userDataServiceProvider: UserDataServiceProvider,
              public app: App) {

  }

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
            this.todoService.newTodoList(data.name);
            this.initTodoLists();
          }
        }
      ]
    });
    prompt.present();
  }

  public editTodoList(todolist: TodoList):void{
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
            todolist.name = data.name;
            this.todoService.editTodoList(todolist);
          }
        }
      ]
    });
    prompt.present();
  }

  public deleteTodoList(todoList: TodoList): void{
    this.todoService.deleteTodoList(todoList);
    this.initTodoLists();
  }

  public itemSelected(uuid): void{
    this.navCtrl.push(TodoItemPage, {
      uuid: uuid
    })
  }

  private initTodoLists(){
    this.todoService.getTodoList().subscribe(
      data => {

        this.items = [];

        for(let i = 0; i < data.length; i++){
          let nbUncompletedItems = 0;

          for(let j = 0; j < data[i].items.length; j++){
            if(!data[i].items[j].complete){
              nbUncompletedItems++;
            }
          }
          this.items.push({list: data[i], nbUncompletedItems: nbUncompletedItems});
        }
      }
    );
  }
}
