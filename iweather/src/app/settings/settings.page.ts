import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { WeatherService } from 'src/services/weather.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  latitude: string;
  longitude: string;

  constructor(
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

  saveForm(){
    let location = {
      latitude: this.latitude,
      longitude: this.longitude
    }
    this.storage.set('location', JSON.stringify(location)).then(
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
}
