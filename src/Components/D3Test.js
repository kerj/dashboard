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

    //routes change every 15 seconds
    changeCurrentRoute = () => {
        let dataToCycle = Object.keys(this.state).slice(3);//an array of keys avail
        //i is routes inside of the current j position
        let i = 0;
        //j is key from state object
        let j = 0;
        
        
        
        
        let routesAvailable = this.state[`${dataToCycle[j]}`].routes;
        setInterval(() => {
            
            if (i >= this.state[`${dataToCycle[j]}`].routes.length - 1) {
                j++
                   if(j > dataToCycle.length -1)  {
                       j = 0
                       routesAvailable = this.state[`${dataToCycle[j]}`].routes;
                   }
                routesAvailable = this.state[`${dataToCycle[j]}`].routes;
                i = 0
            } else {
                i++
            }
        }, 3000);
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
        //fetch data to display with d3
        this.fetchWeatherData()
        this.changeCurrentRoute()
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