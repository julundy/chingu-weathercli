require("dotenv").config();

const axios = require("axios");

async function getWeather(lat, lon, unit) {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/onecall",
      {
        params: {
          lat: lat,
          lon: lon,
          exclude: '["minutely","hourly"]',
          appid: process.env.OPENWEATHER_KEY,
          units: unit,
        },
      }
    );
    if (response.data.cod) {
      throw new Error(
        `Weather API status: ${response.data.cod} - ${response.data.message}`
      );
    }
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
}

function parseWeather(name, weather, args) {
  if (!weather || !weather.current || !weather.daily.length) {
    throw new Error("weather data is incomplete");
  }

  return {
    name: name,
    currentTemp: weather.current.temp,
    isFahrenheit: args.isFahrenheit,
    tomorrow: args.tomorrow,
    detailed: args.detailed,
    currentWeather: weather.current.weather[0].description,
    dayWeather: args.tomorrow
      ? weather.daily[1].weather[0].description
      : weather.daily[0].weather[0].description,
    dayHigh: args.tomorrow
      ? weather.daily[1].temp.max
      : weather.daily[0].temp.max,
    dayLow: args.tomorrow
      ? weather.daily[1].temp.min
      : weather.daily[0].temp.min,
  };
}

service = {
  getWeather,
  parseWeather,
};

module.exports = service;
