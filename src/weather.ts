import { WeatherBuilder } from "./weatherBuilder";

export class Weather {
  placeId: string;
  location: string;
  currentTempF: number;
  currentTempC: number;
  currentWeather: string;
  dayWeather: string;

  constructor(weatherBuilder: WeatherBuilder) {
    this.location = weatherBuilder.location;
    this.currentTempF = weatherBuilder.currentTempF;
    this.currentTempC = weatherBuilder.currentTempC;
    this.currentWeather = weatherBuilder.currentWeather;
    this.dayWeather = weatherBuilder.dayWeather;
  }
}
