import { Weather } from "./weather";

export class WeatherBuilder {
  private _placeId: string;
  private _location: string;
  private _currentTempF: number;
  private _currentTempC: number;
  private _currentWeather: string;
  private _dayWeather: string;

  contructor(placeId: string) {
    this._placeId = placeId;
  }
}
