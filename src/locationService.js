require("dotenv").config();

const axios = require("axios");

const topLocation = (location) => {
  return {
    name: location[0].place_name,
    lat: location[0].center[1],
    lon: location[0].center[0],
  };
};

async function getTopLocation(searchTerm) {
  try {
    if (process.env.MAPBOX_TOKEN.length == 0)
      throw new Error("No MAPBOX_TOKEN found");
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
    throw Error(
      `Error calling map API: ${error.message} -> ${error.response.data.message}`
    );
  }
}

service = {
  getTopLocation,
};

module.exports = service;
