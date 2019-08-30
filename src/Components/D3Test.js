import React, { Component } from 'react';
import RouteManager from './RouteManager';
const axios = require('axios');

class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            currentRoute: 0,
            currentKey: 'weeklyWeather',
            weeklyWeather: {
                routes: [
                    'stackedBar',
                    'donutGraph',
                    'emojiList'
                ]
            },
            dailyWeather: {
                routes: [
                    'singleBar',
                    'stackedBar'
                ]
            },
        }
    }

    fetchWeatherData = () => {
        let weatherQuery = "https://www.metaweather.com/api/location/2475687/";
        axios.get(weatherQuery).then((response) => {
            const weatherResponse = response.data.consolidated_weather;
            this.setState({
                data: weatherResponse,
            });


        })
    }

    componentDidMount() {
        this.fetchWeatherData()

    }

    
    render() {
        return (
            <div>
                {this.state.data.length <= 5
                    ? <h1>Loading Graph</h1>
                    : <RouteManager stateHelper={this.state} />
                }
            </div>
        )
    }
}

export default D3Test;