# chingu-weathercli

Weather CLI for Solo pre-work project

# Overview

WeatherCli is a NodeJS script that receives a location and either Fahrenheit or Celsius and outputs current weather data and forecast

*Example*

```
node app.js new york -f
------------------------------------------
Current temperature in New York, New York, United States is 61.92F.
Conditions are currently: clear sky.
What you should expect: clear sky throughout the day.
------------------------------------------
Weather was added to your weather tracking file, weather.txt 
```
## Prerequisites

You will need Node and NPM installed on your machine before running the script. Download and installation instructions are at https://www.npmjs.com/get-npm. Once installed, ```npm i``` in the project directory.

Create an environment (.env) file in the project root. This file will need three variables:

- MAPBOX_TOKEN This token can be generated upon registering at https://www.mapbox.com/
- OPENWEATHER_KEY This token can be generated upon registering at https://openweathermap.org/guide
- OUTFILE Enter a textfile name for the script to save to e.g. ```weather.txt```

## Parameters

```node app.js <location> [options]```

- **location (required)**: (String) The name of the location. This can be multiple words, and if the Mapbox location service cannot find it, an  error will be returned. Please note that search terms are across the globe, so if the returned location is not what was intended, use a more specific name.
-  **-f or --Fahrenheit**: To view temperatures in Fahrenheit, either this or Celsius options are required.
-  **-c or --Celsius**: To view temperatures in Celsius, either this or Fahrenheit options are required.
-  **-t or --tomorrow**: To get the weather forecast for tomorrow. Default is today.
-  **-d or --detailed**: To view high and low temperatures of the selected forecast.

## Output

Weather information will be output to the console. The location returned is what Mapbox found closest to the search location name. Temperature numbers are colored depending on value. This information is also saved to the filename determined by the OUTFILE environment variable in the project root directory.
