import React, { Component } from 'react';
import DarkSkyApi from 'dark-sky-api';

DarkSkyApi.apiKey = process.env.REACT_APP_DARK_SKY_KEY;

const position = {
	latitude: 41.254079, 
	longitude: -95.958667
};

var options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0
};

function success(pos) {
	console.log(pos)
	position.latitude = pos.coords.latitude;
	position.longitude = pos.coords.longitude;
}

function error(err) {
	console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

const weatherPromise = DarkSkyApi.loadCurrent(position);

const forecastPromise = DarkSkyApi.loadForecast(position);

const directionName = (d) => {
	switch (d) {
		case 'S':
			return 'south';
		case 'N':
			return 'north';
		case 'E':
			return 'east';
		case 'W':
			return 'west';
		default:
			return d
	}
};

class Weather extends Component {
	constructor(props) {
		super(props);
		this.state = {
			weatherData: {},
			forecastData: {}
		};
	}
	componentDidMount() {
		var self = this;
		weatherPromise.then(wdata => {
			self.setState({
				weatherData: wdata
			})
		})
		forecastPromise.then(fdata => {
			self.setState({
				forecastData: fdata
			})
		})
	}
	render() {
		const weather = this.state.weatherData;
		const forecast = this.state.forecastData;

		return (
			<div>
				<hgroup>
					<h1>{weather.apparentTemperature}&deg; &amp; {weather.summary}</h1>
					{ forecast.daily &&
						<h2><span className="forecast_high">{forecast.daily.data[0].apparentTemperatureHigh}&deg;</span> &mdash; <span className="forecast_low">{forecast.daily.data[0].apparentTemperatureLow}&deg;</span></h2>
					}
					<h3>{weather.humidity} relative humidity.</h3>
					<h4>{weather.windSpeed} mph winds from the {directionName(weather.windDirection)} with gusts up to {weather.windGust} mph.</h4>
				</hgroup>
				{ forecast.daily &&
					<p>{forecast.daily.summary}</p>
				}
			</div>
		);
	}
}

export default Weather;