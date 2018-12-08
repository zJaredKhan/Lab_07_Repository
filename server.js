'use strict';

//Application Dependencies
const express = require('express');
const cors = require('cors');

//Load env vars;
require('dotenv').config();
const PORT = process.env.PORT || 3000; //takes from a .env file and then the terminal env

//app
const app = express();
app.use(cors());

// Constructor Functions
function Location(location){
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;  
}

function Weather(weather) {
  this.forcast = weather.summary;
  this.time = weather.time;
}

// Router
app.get('/location', getLocation)

app.get('/weather', getWeather)

//Handlers
function getWeather (request, response) {
  const weatherData = searchForWeather(request.query)
  response.send(weatherData);
}

function getLocation (req, res) {
  const locationData = searchToLatLong(req.query.data); // 'Lynnwood, WA'
  res.send(locationData);
}

function searchForWeather (query) {
  let weatherData = require('./data/darksky.json');
  let dailyArray = [];
  weatherData.daily.data.forEach(forecast => dailyArray.push(new Weather(forecast)));
  // let convertTime = time.1000
  for(let i in dailyArray){
    return {
      forcast: dailyArray[i].forcast,
      // time: (dailyArray[i].time*1000.toDateString()
    };
  }
}

function searchToLatLong(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  return location;
}

// Give error messages if incorrect

app.get('/*', function(req, res) {
  res.status(404).send('Success!');
})

// app.get('/*', function (req, res) {
//   res.status(500).send('Sorry! Something went horribly wrong!');
// })

app.listen(PORT, () => {
  console.log(`app is up on port : ${PORT}`)
})
