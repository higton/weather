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
  hourlySummariesFiltered:any
  hourlySummariesRepeated:any
  resultRelative:any
  resultRelativeWidths:any
  propriety:any
  time24HoursWith_AM_PM:any

  constructor() { }

  ngOnInit() {
    this.description = JSON.parse(this.description)
    console.log(this.dayNumber)
    console.log(this.description)

    this.currentTime = this.getTimeInHour(this.description.hourly.data[0].time)
    let dataSliced = this.getSlicedData(this.dayNumber, this.description.hourly.data, this.currentTime )
    this.hourlySummaries =  this.getHourlySummaries( dataSliced )
    this.hourlySummaries =  this.shortenHourlySummaries( this.hourlySummaries )

    this.hourlySummariesFiltered = this.filterHourlySummaries( this.hourlySummaries )
    dataSliced = this.shortenHourlySummaries( dataSliced )
    this.hourlySummariesRepeated = this.getNumberOfTimesHourlySummariesRepeated( this.hourlySummaries ) 
    this.hourlyWidths = this.transform24HoursInWidthsFormat( this.hourlySummariesRepeated)
    this.time24Hours = this.getTime24Hours(dataSliced)
    this.time24HoursWith_AM_PM = this.concat24HoursWith_AM_PM(dataSliced) 
    if(this.dayNumber < 7){
      this.onClickTemperature()
    }
  }

  getTimeInHour(data){
    let time = new Date(data * 1000);
    return time.getHours()
  }

  getSlicedData(dayNumber:number, array, currentTime){
    let start = this.getStartHour(dayNumber, currentTime)
    let end = this.getEndHour(start)
    return array.slice(start, end)
  }

  getStartHour(dayNumber:number, currentTime){
    let start = 0

    if(0 !== dayNumber){
      start = ((dayNumber - 1)* 24) + (24 - currentTime);
    }
    else{
      start = 0
    }
    return start
  }

  getEndHour(start){
    return start + 24;
  }

  getHourlySummaries(array:any){
    return array.map( value => value.summary)
  }

  filterHourlySummaries(array){
    return array.filter((element:any, index:number, array:any) => {
      if(index + 1=== array.length){
        return true
      }
      else if(index + 1 < array.length){
        return array[index + 1] != array[index]
      }
  })
  }

  shortenHourlySummaries(array:any){
    return array.map(value =>{
      if(value === 'Possible Light Rain and Humid'){
        return 'Light Rain'
      }
      else if(value === 'Humid and Mostly Cloudy'){
        return 'Mostly Cloudy'
      }
      else if(value === 'Possible Light Rain'){
        return 'Light Rain'
      }
      else if(value === 'Possible Drizzle'){
        return 'Drizzle'
      }
      else if(value === 'Humid and Partly Cloudy'){
        return 'Partly Cloudy'
      }
      else if(value === 'Rain and Humid'){
        return 'Rain'
      }
      else if(value === 'Possible Drizzle and Humid'){
        return 'Drizzle'
      }
      else if(value === 'Humid and Overcast'){
        return 'Overcast'
      }
      else return value
    })
  }

  getNumberOfTimesHourlySummariesRepeated(array:any){
    let resultIndex = 0;

    return array.reduce((accumulator:number[], currentValue:any, index:number, array:any) =>{
      if(array.length === index + 1){}
      else if(array[index + 1] !== array[index]){
        resultIndex += 1;
        accumulator[resultIndex] = 1;
      }
      else{
        accumulator[resultIndex] += 1;
      }
      return accumulator;
    }, [1])
  }

  transform24HoursInWidthsFormat(arr){
    return arr.map(value => { 
      return Math.round(value/24 * 100);
    })
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

  getHourlyWidth(max, min, value){
/*     console.log(min)
    console.log(max)
    console.log(value) */
    return Math.round( ( (value - min) / (max - min) ) * 100 )
  }

  getValue(hour, propriety){
    if(propriety === 'uv'){
      return this.description.hourly.data[hour].uvIndex
    }
    if(propriety === 'apparentTemperature'){
      return Math.round(this.description.hourly.data[hour].apparentTemperature)
    }
    if(propriety === 'temperature'){
      return Math.round(this.description.hourly.data[hour].temperature)
    }
    if(propriety === 'precipProbability'){
      return +( (this.description.hourly.data[hour].precipProbability).toFixed(2) );
    }
  }

  concat24HoursWith_AM_PM(data){
    console.log(data)
    return data.map( (value, index, array) => {
      value = this.getTimeInHour(value.time)

      if(value > 12){
        value -= 12;
        let tmp = value.toString()
        return tmp.concat(' ', 'PM');
      }
      else{
        let tmp = value.toString()
        return tmp.concat(' ', 'AM');
      }
    } )
  }

  transform24HoursIn12Hours(data){
    return data.filter( (value, index) => {
      if(index %2 == 0) return true
      else return false
    });
  }

  removeWhiteSpaces(arr){
    return arr.replace(/\s+/g, '')
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
    this.propriety = 'precipProbability'
    this.refreshValues()
  }

  refreshValues(){
    let time12Hours = this.transform24HoursIn12Hours(this.time24Hours)
    this.resultRelative = this.getResultRelative(this.propriety, time12Hours, this.dayNumber, this.currentTime)
    this.resultRelativeWidths = this.getResultRelativeWitdh(this.resultRelative, this.dayNumber, this.propriety)
    console.log('resultRelativeWitdh: ')
    console.log(this.resultRelativeWidths)
  }

  getResultRelative(propriety, time, dayNumber, currentTime){
/*     console.log(propriety)
    console.log(time)
    console.log(dayNumber)
    console.log(currentTime)
 */
    let start = this.getStartHour(dayNumber, currentTime)

    console.log('start: ' + start)
    let result = time.map((value, index) => {
      // console.log(this.getValue(value ,'uv'))
      // console.log('start + index*2: ' + (start+index*2))
      value = this.getValue( start + (index*2), propriety)
      // console.log('value after: ' + value)
      return value
    })
    // console.log(result)

    this.resultRelative = result

    
    console.log(result)

    return result;
  }

  getResultRelativeWitdh(result, dayNumber, propriety){
    let min = this.getMinimumValue(result)
    let max = this.getMaximumValue(result)

    return result.map((value) => {
      return this.getHourlyWidth(max, min, value)
    })
  }

  getMinimumValue(arr){
    return arr.reduce((accumulator, value) => {
      if(accumulator > value){
        accumulator = value;
      }
      return accumulator
    },)
  }

  getMaximumValue(arr){
    return arr.reduce((accumulator, value) => {
      if(accumulator < value){
        accumulator = value;
      }
      return accumulator
    }, 0)
  }
}