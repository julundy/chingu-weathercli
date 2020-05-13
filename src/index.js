require("dotenv").config();
require("colors");

const axios = require("axios");
const service = require("./service");

const args = require("yargs")
  .usage("Usage: $0 <location> [options]")
  .demandCommand(1)
  .help("h")
  .alias("h", "help").argv;

function validateArgs() {
  if (args._.length !== 1) {
    throw new Error("args are incorrect".red);
  } else {
    return args._[0];
  }
}

async function getLocations(searchTerm) {
  try {
    const response = await axios.get(
      "https://api.mapbox.com/geocoding/v5/mapbox.places" +
        `/${searchTerm}.json`,
      {
        params: {
          access_token: process.env.MAPBOX_TOKEN,
        },
      }
    );

    if (!response.data.features)
      throw new Error("no features in response data");
    return response.data.features;
  } catch (error) {
    console.error(error);
  }
}

async function getWeather(lat, lon, unit = "metric") {
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
    if (!response.data) {
      throw new Error("no data in response");
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

function parseWeather(placeName, weather) {
  if (!weather || !weather.current || !weather.daily.length) {
    throw new Error("weather data is incomplete");
  }
  return {
    placeName: placeName,
    currentTemp: weather.current.temp,
    currentWeather: weather.current.weather[0].description,
    dayWeather: weather.daily[0].weather[0].description,
  };
}

function createOutputString(weatherData) {
  return (
    "Current temperature in " +
    weatherData.placeName +
    " is " +
    weatherData.currentTemp +
    ".\n" +
    "Conditions are currently: " +
    weatherData.currentWeather +
    ".\n" +
    "What you should expect: " +
    weatherData.dayWeather +
    " throughout the day." +
    "\n\n" +
    "Wweather was added to your weather tracking file, weather.txt"
  );
}

async function weatherOutput() {
  try {
    const outputString = "weather output: ".blue.bgWhite;
    const place = validateArgs();
    const location = await getLocations(place);
    const placeName = location[0].place_name;
    const lat = location[0].center[1];
    const lon = location[0].center[0];
    const weather = await getWeather(lat, lon);
    console.log(weather);
    const weatherData = parseWeather(placeName, weather);
    const weatherOutput = createOutputString(weatherData);
    console.log(weatherOutput);
  } catch (error) {
    console.log("Error: " + error.message + " node index.js -h for info");
  }
}

weatherOutput();

module.exports = weatherOutput;
