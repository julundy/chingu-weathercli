require("dotenv").config();

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
    d: {
      alias: "detailed",
      describe: "get today's high and low tempuratures",
      type: "boolean",
      default: false,
    },
    t: {
      alias: "tomorrow",
      describe: "get tomorrow's weather",
      type: "boolean",
      default: false,
    },
  })
  .help("h")
  .check((yargs) => {
    let errorMessage = "";
    if (yargs.f == yargs.c) {
      errorMessage =
        "Argument check failed: please use either -f or -c options";
    }

    if (errorMessage.length == 0) {
      return true;
    }

    throw new Error(errorMessage);
  })
  .alias("h", "help").argv;

async function weatherOutput() {
  try {
    const parsedArgs = service.parseArgs(args);
    const weatherData = await service.retrieveWeatherData(parsedArgs);
    console.log(service.createOutputString(weatherData));
    await service.writeToFile(service.createOutputString(weatherData, true));
  } catch (error) {
    console.log(`Error: ${error.message.red} node index.js -h for info`);
  }
}

weatherOutput();

module.exports = weatherOutput;
