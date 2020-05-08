require("dotenv").config();
require("colors");

const axios = require("axios");
const mapboxApiGeocodeEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places`;
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
      mapboxApiGeocodeEndpoint + `/${searchTerm}.json`,
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

async function weatherOutput() {
  const outputString = "weather output: ".blue.bgWhite;
  const place = validateArgs();
  const location = await getLocations(place);

  const locationLatLong = location[0].center;

  console.log(locationLatLong);
}

weatherOutput();
