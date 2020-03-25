import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";
import { from, Observable } from 'rxjs';
import {  Response, Headers, RequestOptions } from "@angular/http";

@Injectable({
  providedIn: 'root'
})

// const params = {
//   access_key : '9fe58942a78e117bb3c875395a608e91',
//   query: 'rome'
// }


export class WeatherService {
  apiKey = "ef24cb03bebdd3e3c5c7813020d6d16d";
  url:string;
  city = 'rome';

  constructor(private http: HttpClient) {
    console.log("Hello WeaherProvider Provider");
    
  }

  getWeather(latitude: string, longitude: string){
    // this.city = city
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'Authorization': 'my-auth-token'
    //   })
    // };
    // // const params = {
    // //   access_key: '9fe58942a78e117bb3c875395a608e91',
    // //   query: city
    // // }
    const url = `https://api.darksky.net/forecast/ef24cb03bebdd3e3c5c7813020d6d16d/${latitude},${longitude}?units=si`;

    return this.http.jsonp(url, "callback");
  }
}
