import {Component, DoCheck} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {TodoServiceProvider} from '../../providers/todo-service/todo-service';
import {TodoItemPage} from '../todoItem/todoItem';
import {TodoList} from '../model/model';

@Component({
  selector: 'todo-list',
  templateUrl: 'todolist.html'
})
export class TodoListPage implements DoCheck{

  items: any[];

  ngDoCheck(): void{
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

  constructor(public navCtrl: NavController,
              private todoService: TodoServiceProvider,
              public alertCtrl: AlertController) {

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
  }

  public itemSelected(uuid): void{
    this.navCtrl.push(TodoItemPage, {
      uuid: uuid
    })
  }
}
