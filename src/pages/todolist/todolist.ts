import {Component, DoCheck} from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {TodoServiceProvider} from '../../services/todo-service';
import {TodoItemPage} from '../todoItem/todoItem';

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
          name: 'Nom',
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
            this.todoService.newTodoList(data.Nom);
          }
        }
      ]
    });
    prompt.present();
  }


  public itemSelected(uuid): void{
    this.navCtrl.push(TodoItemPage, {
      uuid: uuid
    })
  }
}
