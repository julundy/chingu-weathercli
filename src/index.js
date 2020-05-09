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

async function getWeather(lat, lon) {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/onecall",
      {
        params: {
          lat: lat,
          lon: lon,
          exclude: '["minutely","hourly"]',
          appid: process.env.OPENWEATHER_KEY,
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

async function weatherOutput() {
  const outputString = "weather output: ".blue.bgWhite;
  const place = validateArgs();
  const location = await getLocations(place);
  const lat = location[0].center[1];
  const lon = location[0].center[0];
  console.log(location[0]);
  const weather = await getWeather(lat, lon);
  console.log(weather);
}

weatherOutput();

module.exports = weatherOutput;
