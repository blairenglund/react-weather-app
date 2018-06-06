import React, { Component } from 'react';
import DarkSkyApi from 'dark-sky-api';

DarkSkyApi.apiKey = process.env.REACT_APP_DARK_SKY_KEY;

const position = {
	latitude: 41.254079, 
	longitude: -95.958667
};

const weatherPromise = DarkSkyApi.loadCurrent(position);

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
			weatherData: {}
		};
	}
	componentDidMount() {
		var self = this;
		weatherPromise.then(data => {
			self.setState({
				weatherData: data
			})
		})
	}
	render() {
		const weather = this.state.weatherData;

		console.log(weather);
		return (
			<hgroup>
				<h1>{weather.apparentTemperature}&deg; &amp; {weather.summary}</h1>
				<h2>{weather.humidity} relative humidity</h2>
				<h2>{weather.windSpeed} mph winds from the {directionName(weather.windDirection)} with gusts up to {weather.windGust} mph</h2>
			</hgroup>
		);
	}
}

export default Weather;