import React, { Component } from 'react';
import RouteManager from './RouteManager';
const axios = require('axios');

class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            weeklyWeather: {
                routes: [
                    'stackedBar',
                    'donutGraph',
                    'emojiList'
                ]
            },
            farAwayWeather: {
                routes: [
                    'donutGraph',
                    'stackedBar',
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
            // let farWeatherQuery = "https://www.metaweather.com/api/location/44418/";
            // axios.get(farWeatherQuery).then((response) => {
            //     const farWeatherResponse = response.data.consolidated_weather;
            //     this.setState({
            //         data: this.state.data.concat(farWeatherResponse),
            //     });

            // })  
        })
        
    }

    // fetchFarWeatherData = () => {
    //     let weatherQuery = "https://www.metaweather.com/api/location/44418/";
    //     axios.get(weatherQuery).then((response) => {
    //         const weatherResponse = response.data.consolidated_weather;

    //         this.setState({
    //             data: this.state.data.concat(weatherResponse),
    //         });
    //         console.log(this.state.data);
    //     })

    // }

    componentDidMount() {
                this.fetchWeatherData()
                // this.fetchFarWeatherData()
            }

    render() {
                return(
            <div>
            {
                this.state.data.length >= 6
                    ? <h1>Loading Graph</h1>
                    : <RouteManager stateHelper={this.state} />
            }
            </div >
        )
    }
}

export default D3Test;