require("dotenv").config();
require("colors");

const axios = require("axios");
const mapboxApiGeocodeEndpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places`;
const service = require("./service");
const peopleObject = require("./person.json");

const args = require("yargs")
  .usage("Usage: $0 <location> [options]")
  .demandCommand(1)
  .help("h")
  .alias("h", "help").argv;

const validateArgs = () => {
  if (args._.length !== 1) {
    throw new Error("args are incorrect".red);
  } else {
    return args._[0];
  }
};

const getLocation = (searchTerm) => {
  axios
    .get(mapboxApiGeocodeEndpoint + `/${searchTerm}.json`, {
      params: {
        access_token: process.env.MAPBOX_TOKEN,
      },
    })
    .then((response) => {
      console.log("features are" + response.data.features);
      return response.data.features[0];
    })
    .catch((error) => {
      console.log(error);
      throw new Error("error on call to mapbox");
    });
};

const weatherOutput = () => {
  try {
    const place = validateArgs();
    const location = getLocation(place);
    const outputString = "weather output: ".blue.bgWhite;
    return outputString + place + " is at " + location;
  } catch (e) {
    return "error: " + e;
  }
};

// console.log("person is " + peopleObject.people.person.favoriteFoods[1]);

console.log(weatherOutput());
