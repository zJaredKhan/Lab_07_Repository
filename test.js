'use strict';
// Application Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
// Load env vars;
require('dotenv').config();
const PORT = process.env.PORT || 3000;
// App
const app = express();
app.use(cors());
// Error handling
function handleError(res) {
  res.status(500).send('Sorry something went wrong!');
}
// Get location data
app.get('/location', (req, res) => {
  return searchToLatLong(req.query.data)
  .then(locationData => {
  if (!locationData) {
    handleError(res);
  }
    res.send(locationData);
})
});
function searchToLatLong(query) {
  return superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`)
  .then(geoData => {
  const location = new Location(geoData.results[0]);
  return location;
  })
function Location(query, location) {
  this.search_query = query;
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude = location.geometry.location.lng;
}
// Get weather data
app.get('/weather', (req, res) => {
  const weatherData = getWeather(req.query.data);
  if (!weatherData) {
    handleError(res);
  }
  res.send(weatherData);
});
function getWeather(query) {
  const weatherJson = require('./data/darksky.json');
  const weather = new Weather(weatherJson);
  return weather;
}
function Weather(weatherJson) {
  return weatherJson.daily.data.map(day => {
    return {
      forecast: day.summary,
      time: new Date(day.time * 1000).toDateString()
    }
  });
}
// Bad path 
app.get('/*', function(req, res) {
  res.status(404).send('You are in the wrong place');
});
// Listen
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)}
);