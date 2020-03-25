import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  latitude: string;
  longitude: string;

  constructor(
    private storage:Storage) {
    
    this.storage.get('location').then(val => {
      if(val != null){
        let location = JSON.parse(val);
        this.latitude = location.latitude;
        this.longitude = location.longitude;
      } else{
        this.latitude = '-15.826691';
        this.longitude = '-47.921822';
      }
    })
   }

  ngOnInit() {
  }

  saveForm(){
    let location = {
      latitude: this.latitude,
      longitude: this.longitude
    }
    this.storage.set('location', JSON.stringify(location));
  }
}
