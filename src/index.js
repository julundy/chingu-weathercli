require("dotenv").config();
require("colors");

const fs = require("fs");
const axios = require("axios");
const service = require("./service");

const args = require("yargs")
  .usage("Usage: $0 <location> [options]")
  .demandCommand(1)
  .options({
    f: {
      alias: "Fahrenheit",
      describe: "temperature in Fahrenheit",
      type: "boolean",
      default: false,
    },
    c: {
      alias: "Celsius",
      describe: "temperature in Celsius",
      type: "boolean",
      default: false,
    },
  })
  .help("h")
  .check((yargs) => {
    if (yargs.f !== yargs.c) {
      return true;
    }
    throw new Error(
      "Argument check failed: please use either -f or -c options"
    );
  })
  .alias("h", "help").argv;

function parseArgs() {
  return {
    searchTerm: args._.join(" "),
    f: args.f,
  };
}

const topLocation = (location) => {
  return {
    name: location[0].place_name,
    lat: location[0].center[1],
    lon: location[0].center[0],
  };
};

async function getTopLocation(searchTerm) {
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

    if (!response.data.features.length)
      throw new Error(
        "No results from MapBox with search term: ".red + searchTerm
      );
    return topLocation(response.data.features);
  } catch (error) {
    throw Error(error);
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
    if (response.data.cod) {
      throw new Error(
        `Weather API status: ${response.data.cod} - ${response.data.message}`
      );
    }
    return response.data;
  } catch (error) {
    throw new Error(error);
  }
}

function parseWeather(name, weather, inFahrenheit) {
  if (!weather || !weather.current || !weather.daily.length) {
    throw new Error("weather data is incomplete");
  }
  return {
    name: name,
    currentTemp: weather.current.temp,
    inFahrenheit: inFahrenheit,
    currentWeather: weather.current.weather[0].description,
    dayWeather: weather.daily[0].weather[0].description,
  };
}

function createOutputString(weatherData, toFile = false) {
  let weatherTempColor;
  if (weatherData.f) {
    if (weatherData.currentTemp > 90) {
      weatherTempColor = "red";
    } else if (weatherData.currentTemp < 40) {
      weatherTempColor = "blue";
    } else {
      weatherTempColor = "cyan";
    }
  } else {
    if (weatherData.currentTemp > 30) {
      weatherTempColor = "red";
    } else if (weatherData.currentTemp < 10) {
      weatherTempColor = "blue";
    } else {
      weatherTempColor = "cyan";
    }
  }

  const tempType = weatherData.inFahrenheit ? "F" : "C";

  let firstLine = `Current temperature in ${
    toFile ? weatherData.name : weatherData.name.green
  } is ${
    toFile
      ? weatherData.currentTemp
      : weatherData.currentTemp.toString()[weatherTempColor]
  }${toFile ? tempType : tempType[weatherTempColor]}.`;

  let secondLine = `Conditions are currently: ${
    toFile ? weatherData.currentWeather : weatherData.currentWeather.cyan
  }.`;

  let thirdLine = `What you should expect: ${
    toFile ? weatherData.dayWeather : weatherData.dayWeather.cyan
  } throughout the day.`;

  return [
    "------------------------------------------",
    firstLine,
    secondLine,
    thirdLine,
    "------------------------------------------\n",
  ].join("\n");
}

function writeToFile(weatherOutput) {
  fs.appendFile("weather.txt", weatherOutput, (error) => {
    if (error) {
      throw error;
    }
    console.log(
      `Weather was added to your weather tracking file, ${process.env.OUTFILE.yellow} \n`
    );
  });
}

async function weatherOutput() {
  try {
    const parsedArgs = parseArgs();
    const location = await getTopLocation(parsedArgs.searchTerm);
    const weather = await getWeather(location.lat, location.lon);
    const weatherData = parseWeather(location.name, weather, parseArgs.f);
    console.log(createOutputString(weatherData));
    writeToFile(createOutputString(weatherData, true));
  } catch (error) {
    console.log(`Error: ${error.message.red} node index.js -h for info`);
  }
}

weatherOutput();

module.exports = weatherOutput;
