require("dotenv").config();
require("colors");

const locationService = require("./locationService");
const weatherService = require("./weatherService");
const fs = require("fs");

function parseArgs(args) {
  return {
    searchTerm: args._.join(" "),
    isFahrenheit: args.f,
    detailed: args.d,
    tomorrow: args.t,
  };
}

async function retrieveWeatherData(args) {
  const searchTerm = args.searchTerm;
  const unit = args.isFahrenheit ? "imperial" : "metric";
  try {
    const topLocation = await locationService.getTopLocation(searchTerm);
    const weatherData = await weatherService.getWeather(
      topLocation.lat,
      topLocation.lon,
      unit
    );
    return weatherService.parseWeather(topLocation.name, weatherData, args);
  } catch (error) {
    throw new Error(error.message);
  }
}

function createOutputString(weatherData, toFile = false) {
  const tempType = weatherData.isFahrenheit ? "F" : "C";

  const firstLine = () => {
    return `Current temperature in ${
      toFile ? weatherData.name : weatherData.name.green
    } is ${
      toFile
        ? weatherData.currentTemp
        : weatherData.currentTemp.toString()[
            tempColor(weatherData.currentTemp, weatherData.isFahrenheit)
          ]
    }${
      toFile
        ? tempType
        : tempType[tempColor(weatherData.currentTemp, weatherData.isFahrenheit)]
    }.`;
  };
  const secondLine = () => {
    return `Conditions are currently: ${
      toFile ? weatherData.currentWeather : weatherData.currentWeather.cyan
    }.`;
  };

  const thirdLineEnd = () => {
    return weatherData.tomorrow ? "throughout tomorrow" : "throughout the day";
  };

  const thirdLineDetail = () => {
    const tempHighColor = tempColor(
      weatherData.dayHigh,
      weatherData.isFahrenheit
    );
    const tempLowColor = tempColor(
      weatherData.dayLow,
      weatherData.isFahrenheit
    );

    return weatherData.detailed
      ? ` with a high of ${
          toFile
            ? weatherData.dayHigh
            : weatherData.dayHigh.toString()[tempHighColor]
        }${toFile ? tempType : tempType[tempHighColor]} and a low of ${
          toFile
            ? weatherData.dayLow
            : weatherData.dayLow.toString()[tempLowColor]
        }${toFile ? tempType : tempType[tempLowColor]}`
      : "";
  };
  const thirdLine = () => {
    return `What you should expect: ${
      toFile ? weatherData.dayWeather : weatherData.dayWeather.cyan
    } ${thirdLineEnd()}${thirdLineDetail()}.`;
  };
  return [
    "------------------------------------------",
    firstLine(),
    secondLine(),
    thirdLine(),
    "------------------------------------------",
  ].join("\n");
}

const tempColor = (temp, isFahrenheit) => {
  let weatherTempColor;

  if (isFahrenheit) {
    if (temp > 86) {
      weatherTempColor = "red";
    } else if (temp < 40) {
      weatherTempColor = "blue";
    } else {
      weatherTempColor = "cyan";
    }
  } else {
    if (temp > 30) {
      weatherTempColor = "red";
    } else if (temp < 10) {
      weatherTempColor = "blue";
    } else {
      weatherTempColor = "cyan";
    }
  }
  return weatherTempColor;
};

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

service = {
  parseArgs,
  retrieveWeatherData,
  createOutputString,
  writeToFile,
};

module.exports = service;
