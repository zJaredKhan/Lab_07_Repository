'use strict';

// Application Dependencies
const express = require('express');
const cors = require('cors');
const request = require('superagent');

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
  const locationData = searchToLatLong(req.query.data || 'lynwood');
  if (!locationData) {
    handleError(res);
  }
  res.send(locationData);
});

function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(query, geoData.results[0]);
  return location;
}

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

//Yelp
app.get('/yelp', getBusiness)

function Yelp(business) {
  this.name = business.name;
  this.image_url = business.image_url;
  this.price = business.price;
  this.rating = business.rating;
  this.url = business.url;
}

function getBusiness (req, res) {
  return searchForBusiness(request.query.data)
  .then(businessData => {
    res.send(businessData);
  })
}

function searchForBusiness (query) {
  const url = `https://api.yelp.com/v3/businesses/search?location=${query}`

  superagent.get(url)
  .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
  .then(yelpData => {
    const yelp = new Yelp(yelpData);
    yelp.map()
    return yelp;
  })
}
// Bad path 
app.get('/*', function(req, res) {
  res.status(404).send('You are in the wrong place');
});


// Listen
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)}
);