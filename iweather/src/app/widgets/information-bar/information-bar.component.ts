import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-information-bar',
  templateUrl: './information-bar.component.html',
  styleUrls: ['./information-bar.component.scss'],
})
export class InformationBarComponent implements OnInit {

  @Input() description: any;
  @Input() dayNumber: any;

  vetor:any
  hourlySummary:{
    summary:string;
    width:number;
  }
  hourlySummaries:any
  hourlyWidths:number[]
  time24Hours:any
  currentTime:number
  hourlySummariesRepeated:any
  resultRelative:any
  resultRelativeWidths:any
  propriety:any

  constructor() { }

  ngOnInit() {
    this.description = JSON.parse(this.description)
    console.log(this.dayNumber)
    console.log(this.description)

    this.currentTime = this.getTimeInHour(this.description.hourly.data[0].time)
    let dataSliced = this.getSlicedData(this.dayNumber, this.description.hourly.data, this.currentTime )
    this.hourlySummaries =  this.getHourlySummaries( dataSliced )
    this.hourlySummariesRepeated = this.getHourlySummariesRepeated( dataSliced ) 
    this.hourlyWidths = this.transformInWidthsFormat( this.hourlySummariesRepeated)
    this.time24Hours= this.getTime24Hours(dataSliced)

    if(this.dayNumber < 7){
      this.onClickUvIndex()
    }
  }


  getHourlyWidth(max, min, value){
    return Math.round( ( (value - min) / (max - min) ) * 100 )
  }

  getMinimumValue(day, propriety){
    if(propriety === 'uv'){
      return 0
    }
    if(propriety === 'apparentTemperature'){
      return this.description.daily.data[day].apparentTemperatureMin
    }
    if(propriety === 'temperature'){
      return this.description.daily.data[day].temperatureMin
    }
    if(propriety === 'precipIntensity'){
      return 0
    }
  }

  getMaximumValue(day, propriety){
    if(propriety === 'uv'){
      return 12
    }
    if(propriety === 'apparentTemperature'){
      return this.description.daily.data[day].apparentTemperatureMax
    }
    if(propriety === 'temperature'){
      return this.description.hourly.data[day].temperatureMax
    }
    if(propriety === 'precipIntensity'){
      return this.description.hourly.data[day].precipIntensityMax
    }
  }

  getValue(hour, propriety){
    if(propriety === 'uv'){
      return this.description.hourly.data[hour].uvIndex
    }
    if(propriety === 'apparentTemperature'){
      return Math.round( this.description.hourly.data[hour].apparentTemperature )
    }
    if(propriety === 'temperature'){
      return Math.round( this.description.hourly.data[hour].temperature )
    }
    if(propriety === 'precipIntensity'){
      return this.description.hourly.data[hour].precipIntensity
    }
  }

  getTime24Hours(data){
    return data.map( (value) => {
      // console.log('getTimeInHour(value.time): ' + this.getTimeInHour(value.time))
      value = this.getTimeInHour(value.time)
      if(value > 12){
        value -= 12;
      }

      return value
    })
  }

  concat24HoursWith_AM_PM(data){
    return data.filter( (value, index) => index<24).reduce( (accumulator, value, index, array) => {
      array[index] =  this.getTimeInHour(array[index])

      if(array[index] > 12){
        array[index] -= 12;
        let tmp = array[index].toString()
        array[index] = tmp.concat(' ', 'PM');
      }
      else{
        let tmp = array[index].toString()
        array[index] = tmp.concat(' ', 'AM');
      }

      return array
    }, 0)
  }

  transform24HoursIn12Hours(data){
    return data.filter( (value, index) => {
      if(index %2 == 0) return true
      else return false
    });
  }

  getSlicedData(dayNumber:number, array, currentTime){
    let start = this.getStart(dayNumber, currentTime)
    let end = this.getEndValue(start)
    return array.slice(start, end)
  }

  getStart(dayNumber:number, currentTime){
    let start = 0

    if(0 !== dayNumber){
      start = ((dayNumber - 1)* 24) + (24 - currentTime);
    }
    else{
      start = 0
    }
    return start
  }

  getEndValue(start){
    return start + 24;
  }

  getHourlySummaries(array:any){
    return array.filter((element:any, index:number, array:any) => {
      if(index + 1=== array.length){
        return true
      }
      else if(index + 1 < array.length){
        return array[index + 1].summary != array[index].summary
      }
  }).map( value => value.summary)

  }
  getHourlySummariesRepeated(array:any){
    let resultIndex = 0;

    return array.reduce((accumulator:number[], currentValue:any, index:number, array:any) =>{
      if(array.length === index + 1){}
      else if(array[index + 1].summary !== array[index].summary){
        resultIndex += 1;
        accumulator[resultIndex] = 1;
      }
      else{
        accumulator[resultIndex] += 1;
      }
      return accumulator;
    }, [1])
  }

  transformInWidthsFormat(arr){
    return arr.map(value => { 
      return Math.round(value/24 * 100);
    })
  }

  removeWhiteSpaces(arr){
    return arr.replace(/\s+/g, '')
  }

  getTimeInHour(data){
      let time = new Date(data * 1000);
      return time.getHours()
  }

  arrayOne(n:number){
    return Array(n);
  }

  onClickUvIndex(){
    this.propriety = 'uv'
    this.refreshValues()

  }

  onClickApparentTemperature(){
    this.propriety = 'apparentTemperature'
    this.refreshValues()
  }

  onClickTemperature(){
    this.propriety = 'temperature'
    this.refreshValues()
  }

  onClickPrecipIntensity(){
    this.propriety = 'precipIntensity'
    this.refreshValues()
  }

  refreshValues(){
    let time12Hours = this.transform24HoursIn12Hours(this.time24Hours)
    this.resultRelative = this.getResultRelative(this.propriety, time12Hours, this.dayNumber, this.currentTime)
    this.resultRelativeWidths = this.getResultRelativeWitdh(this.resultRelative, this.dayNumber, this.propriety)
  }

  getResultRelative(propriety, time, dayNumber, currentTime){
    console.log(propriety)
    console.log(time)
    console.log(dayNumber)
    console.log(currentTime)

    let start = this.getStart(dayNumber, currentTime)

    console.log('start: ' + start)
    let result = time.map((value, index) => {
      // console.log(this.getValue(value ,'uv'))
      console.log('start + index*2: ' + (start+index*2))
      value = this.getValue( start + 1 + (index*2), propriety)
      console.log('value after: ' + value)
      return value
    })
    console.log(result)

    this.resultRelative = result

    
    console.log(result)

    return result;
  }

  getResultRelativeWitdh(result, dayNumber, propriety){
    let min = this.getMinimumValue(dayNumber, propriety)
    let max = this.getMaximumValue(dayNumber, propriety)

    return result.map((value) => {
      return this.getHourlyWidth(max, min, value)
    })
  }
}