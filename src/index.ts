const axios = require("axios");
const args = require("yargs").argv;

const validateArgs = () => {
  // if (args_.length)
};

const weatherOutput = () => {
  console.log(args);

  return "weather output: " + args._[0];
};

console.log(weatherOutput());
