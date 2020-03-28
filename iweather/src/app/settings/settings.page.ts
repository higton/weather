import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WeatherService } from 'src/services/weather.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { stringify } from 'querystring';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  latitude: string;
  longitude: string;
  country: string;
  estate: string;
  city:string;
  searchedCountry:string;
  searchedState:string;
  searchedCity:string;
  
  constructor(
    private localNotifications: LocalNotifications,
    private weatherService: WeatherService,
    private router: Router,
    private storage:Storage,
    public alertController: AlertController,
    ) {
    this.refreshLatitudeAndLongitudeValue();
   }


  ngOnInit() {
  }

  refreshLatitudeAndLongitudeValue(){
    this.storage.get('searchedResult').then(val => {
      console.log(JSON.parse(val));
      if(val != null){
        let searchedResult = JSON.parse(val);
        this.searchedCountry = searchedResult.address.country;
        this.searchedCity = searchedResult.address.city;
        this.searchedState = searchedResult.address.state;
      } else{
        this.searchedCountry = 'Unitated States of America';
        this.searchedCity = 'Broadway';
        this.searchedState = 'New York'
        }
    })
  }

/*   async getAPILocation(){
    this.weatherService.getLocation(this.searchedLocation).subscribe(data => {
      this.get
    })
  } */

  async saveForm(){
    // await this.getAPILocation()
    let searchedLocation = `${this.searchedCity},${this.searchedState},${this.searchedCountry}`
    console.log(searchedLocation)
    this.weatherService.getLocation(searchedLocation).subscribe(data => {
      let searchedResult = data[0];
      this.storageSearchedResult(searchedResult)
    })
  }

  storageSearchedResult(searchedResult:any){
    this.storage.set('searchedResult', JSON.stringify(searchedResult)).then(
      ()  => this.weatherService.publishEventToHomePage()
    );
  }
  
  async presentAlert(){
    const alert = await this.alertController.create({
      header: 'Are you sure about it?',
      message: 'change latitude and longitude',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: (blah) => {
            console.log('canceled')
          }
        },
        {
          text: 'Okay',
          handler: () => {
            this.saveForm()
            this.presentNotification()
            this.goToHomePage()
            console.log('confirmed');
          }
        }]
    });

    await alert.present();
  }

  goToHomePage(){
    this.router.navigate(['/tabs/home'])
  }

  presentNotification(){
    this.localNotifications.schedule({
      title: 'Notification',
      text: 'Location is changed',
      foreground: true,
    })
  }
}
