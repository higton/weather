import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  apiKey = "ef24cb03bebdd3e3c5c7813020d6d16d";
  url:string;
  city = 'rome';

  subject$ = new Subject<number>();

  constructor(private http: HttpClient) {
    console.log("Hello WeaherProvider Provider");
  }

  getWeather(latitude: string, longitude: string){
    
    const url = `https://api.darksky.net/forecast/ef24cb03bebdd3e3c5c7813020d6d16d/${latitude},${longitude}?extend=hourly&units=si`;

    return this.http.jsonp(url, "callback");
  }

  getLocation(location: string){
    const url = "https://nominatim.openstreetmap.org/"
    let params = new HttpParams()
    params = params.append('addressdetails', '1')
    params = params.append('q', location)
    params = params.append('format', 'json')
    params = params.append('limit', '1')

    return this.http.get(url, {params: params});
  }

  publishEventToHomePage(){
    this.subject$.next(1);
  }

  jsonStringify(tmp:any){
    return JSON.stringify(tmp)
  }
  
  roundNumber(number:number){
    return Math.round(number)
  }

  convertTimeToDays(data:any){
    console.log(data)
    let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']    
    return data.map( (element:any, index:number) => {
      index = index + 1;
      let date = new Date(element.time * 1000);

      if(index === 1){
         return 'Today';
      }
      else{
        return days[date.getDay()];
      }
    }, 0)
  }
}
