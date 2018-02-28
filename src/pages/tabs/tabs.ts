import { Component } from '@angular/core';

import { TodoListPage } from '../todolist/todolist';
import { HomePage } from '../home/home';
import {ProfilePage} from '../profile/profile';
import {MapPage} from '../map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = TodoListPage;
  tab3Root = ProfilePage;

  constructor() {}
}
