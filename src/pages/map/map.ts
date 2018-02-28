import {Component, ElementRef, ViewChild} from '@angular/core';
import {UserDataServiceProvider} from '../../providers/user-data-service/user-data-service';
import { Geolocation } from '@ionic-native/geolocation';
import {App, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {DatabaseServiceProvider} from '../../providers/database-service/database-service';
import {StorageDataServiceProvider} from '../../providers/storage-data-service/storage-data-service';

declare var google;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})

export class MapPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  list:any;

  constructor(public userDataServiceProvider: UserDataServiceProvider,
              private navParams: NavParams,
              public app: App,
              public geolocation: Geolocation,
              public databaseServiceProvider: DatabaseServiceProvider,
              public storageDataServiceProvider: StorageDataServiceProvider) {}


  ngOnInit(){
    if(this.userDataServiceProvider.isLoggedIn()){
      this.databaseServiceProvider.getOneTodoList(this.navParams.get('uuid')).subscribe(
        data => {
          this.list = data[0]
        });
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

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(this.list.position.latitude, this.list.position.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    }, (err) => {
      console.log(err);
    });
  }

  addMarker(){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
    let content = "<h4>Information!</h4>";
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  private initTodoItemsFromStorage() {
    this.storageDataServiceProvider.getOneTodoList(this.navParams.get('uuid'))
      .then((list)=>{this.list = list});
  }
}
