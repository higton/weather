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
  searchedResult:{
    lat:string,
    lon:string,
    address:{
      country: string,
      state: string,
      city: string,
      station: string,
    }
  }

  constructor(
    private weatherService:WeatherService,
    private storage:Storage)
    { }

  ngOnInit() {
    this.checkForEvent();

    this.getLocationValueAndMakeRequest()
  }
  
  checkForEvent(){
    this.weatherService.$subject.subscribe(data => {
      if(data == 1){
        this.ngOnInit()
      } 
    })
  }

  getLocationValueAndMakeRequest(){
    this.storage.get('searchedResult').then((val) => {
      console.log(JSON.parse(val))
      if(val != null){
        this.searchedResult = JSON.parse(val);
      } else {
        console.log("akii")
        this.searchedResult = {
          lat: '-15.826691',
          lon: '-47.921822',
          address:{
            country: 'Brazil',
            state: 'DF',
            city: 'Taguatinga',
            station: ''
          }
        }
      }
      this.getAPIWeatherData();
    });
  }

  getAPIWeatherData(){
    this.weatherService
    .getWeather(this.searchedResult.lat, this.searchedResult.lon)
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
  
  roundNumber(number:number){
    return Math.round(number)
  }

  ngOnDestroy(){
    console.log('destroy')
    this.weatherService.$subject.unsubscribe();
  }
}
