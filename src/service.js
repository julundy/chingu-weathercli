const axios = require("axios");

function validateArgs() {
  if (args._.length !== 1) {
    throw new Error("args are incorrect".red);
  } else {
    return args._[0];
  }
}

async function getLocations(searchTerm) {
  try {
    if (!searchTerm) throw new Error("no search term parameter");
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
    throw { error: error.message };
  }
}

service = {
  validateArgs,
  getLocations,
};

module.exports = service;
