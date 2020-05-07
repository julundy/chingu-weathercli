const axios = require("axios");
const colors = require("colors");
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

var weatherOutput = function () {
  try {
    const args = validateArgs();
    const outputString = "weather output: ".blue.bgWhite;
    return outputString + args;
  } catch (e) {
    return "error: " + e;
  }
};
console.log(weatherOutput());
