import { Component, OnInit } from '@angular/core';
import { WeatherService } from 'src/services/weather.service';
import { subscribeOn } from 'rxjs/operators';
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
    private weatherService:WeatherService,
    private storage:Storage)
    { }

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
      this.weatherService.getWeather(this.location.latitude, this.location.longitude).subscribe(data =>
           {this.weather = data; console.log(data);});
    });

  }

  getImageUrl():string{
    return `../assets/images/${this.weather.currently.icon}.png`
  }
}
