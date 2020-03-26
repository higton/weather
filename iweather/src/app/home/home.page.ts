import { Component, OnInit, NgZone } from '@angular/core';
import { WeatherService } from 'src/services/weather.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  weather:any;
  location:{
    latitude:string,
    longitude:string
  }

  constructor(
    private ngZone: NgZone,
    private weatherService:WeatherService,
    private storage:Storage)
    { 
      this.weatherService.$subject.subscribe(data => {
        if(data == 1){
          this.ngOnInit()
          console.log('foi')
          this.storage.get('location').then((val) => {
            if(val != null){
              console.log(JSON.parse(val));
            }
          });
        } 
      })
    }

  ngOnInit() {
    this.storage.get('location').then((val) => {
      if(val != null){
        this.location = JSON.parse(val);
      } else {
        this.location = {
          latitude: '-15.826691',
          longitude: '-47.921822'
        }
      }
      this.getApiData();
    });
  }

  getApiData(){
    this.weatherService
    .getWeather(this.location.latitude, this.location.longitude)
    .subscribe(
      (data)=>{
        this.weather = data;
        console.log(data);
      },
      (error) => console.log(error)
    );
  }

  getImageUrl():string{
    return `../assets/images/${this.weather.currently.icon}.png`
  }
}
