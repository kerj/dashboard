import React, { Component } from 'react';
import RouteManager from './RouteManager';
const axios = require('axios');

class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            weeklyWeather: [],
            routes: [
                'barChart',
                'donutGraph',
                'singleBar',
                'emojiList'
            ],
            currentRoute: 'barChart'
        }
    }

    //routes change every 15 seconds
    changeCurrentRoute = () => {
        let i = 0;
        setInterval(() => {
            if (i >= this.state.routes.length - 1) {
                i = 0
            } else { i++ }
            this.setState({
                currentRoute: this.state.routes[i]
            })
        }, 15000);
    }

    fetchWeatherData = () => {
        let weatherQuery = "https://www.metaweather.com/api/location/2475687/";
        axios.get(weatherQuery).then((response) => {
            const weatherResponse = response.data.consolidated_weather;
            this.setState({ weeklyWeather: weatherResponse });

        })
    }

    componentDidMount() {
        //fetch data to display with d3
        this.fetchWeatherData()
        this.changeCurrentRoute()
    }

    render() {
        return (
            <div>
                {this.state.weeklyWeather.length <= 5
                    ? <h1>Loading Graph</h1>
                    : <RouteManager stateHelper={this.state} />
                }
            </div>
        )
    }
}

export default D3Test;