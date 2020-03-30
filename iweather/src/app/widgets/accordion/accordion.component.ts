import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent implements OnInit {
  @Input() description: any;
  @Input() day: number;
  @Input() weeklyMaxTemperature: number;
  @Input() weeklyMinTemperature: number;
  @Input() dailyMaxTemperature: number;
  @Input() dailyMinTemperature: number;
  @Input() image : string;

/* The change event that will be broadcast to the parent component when the user interacts*/
  @Output()
  change : EventEmitter<string> = new EventEmitter<string>();

  public isMenuOpen : boolean = false;
  public percentageTemperatureMin:number;
  public percentageDailyTemperature:number;

  constructor() {}

  ngOnInit() {
    this.description = JSON.parse(this.description)
    console.log(this.description)
    console.log(this.day)
    
    this.calculateStyleForTemperatureBar()
  }

  calculateStyleForTemperatureBar(){
    let weeklyAverageTemperature = this.weeklyMaxTemperature - this.weeklyMinTemperature
    let dailyAverageTemperature = this.dailyMaxTemperature - this.dailyMinTemperature

    let dailyDifferenceTemperatureMin = this.dailyMinTemperature - this.weeklyMinTemperature

    this.percentageTemperatureMin = Math.round(100 * (dailyDifferenceTemperatureMin/weeklyAverageTemperature));
    this.percentageDailyTemperature = Math.round(100 * (dailyAverageTemperature/weeklyAverageTemperature));
  }
  
  public toggleAccordion() : void{
    this.isMenuOpen = !this.isMenuOpen;
  }

  //Broadcast the name of the accordion clicked
  public broadcastName(name: string) : void{
    this.change.emit(name);
  }

  public applyStyleWidth(){
    let styles = {
      'width': `${this.percentageDailyTemperature}%`,
    }
    return styles;
  }

  public applyStyleMargin(){
    let styles = {
      'margin-left': `${this.percentageTemperatureMin}%`
    }
    return styles;
  }

  roundNumber(number:number){
    return Math.round(number)
  }
}
