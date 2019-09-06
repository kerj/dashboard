import React, { Component } from 'react';
import RouteManager from './RouteManager';
const axios = require('axios');

class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            data: {},
            // omoGames: {
            //     routes: [
            //         'stackedBarChutes',
            //         'stackedBarFletcher',
            //         'stackedBarVortex',
            //         'stackedBarMarie',
            //         // 'stackedBarDorian',
            //     ]
            // },
            // omoStories: {
            //     routes: [
            //         'listMostCompleted',
            //         'listMostStarted'
            //     ]
            // },
            // omhofWeekly: {
            //     routes: [
            //         'listWeekAwards',
            //     ]
            // },
            // omhofDaily: {
            //     routes: [
            //         'awardOfTheDay',
            //     ]
            // },
            timbers: {
                routes: [
                    'listWeekTopEmojis',
                    'stackedBarNewVReturn',
                    'mostPopularEmoji',
                    'mobileIosVsAndroid'
                ]
            }
        }
    }

    fetchWeatherData = () => {
        // let timbersQuery = 'http://sticky-data.local:8888/projects-dash/?project=timbers';
        // axios.get(timbersQuery).then((response) => {
            //different objects need passed for each timbers view dependent on the order they are listed in the routes slice
        //     console.log(response.data);
            
        // })
        // let omoQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omo';
        // axios.get(omoQuery).then((response) => {
        //     const omo = response.data;

        //     let omhofQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omhof';
        //     axios.get(omhofQuery).then((response) => {  
        //         const omhof = response.data;
        //         let omhofRawWeeklyData = {}
        //             omhofRawWeeklyData.weekly = new Object(omhof['kiosks-7day'])
        //         let omhofRawDailyData = {}
        //             omhofRawDailyData.daily = new Object(omhof['kiosks-today'])
        //         const weeklyData = Object.values(omo);
        //         console.log(weeklyData);
                
        //         //weeklyData[x] happens for each route position 
        //         //since omhof routes each only have 1 route they only need to live inside the 0 position in the prop data to routemanager
        //         this.setState({
        //             data: Object.assign(weeklyData[0], omhofRawWeeklyData),
        //             data: Object.assign(weeklyData[0], omhofRawDailyData),
        //             data: weeklyData
        //         });
        //         this.setState({ loaded: true })
        //     })
        // })
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
        return (
            <div>
                {
                    this.state.loaded ? <RouteManager stateHelper={this.state} /> : <h1>Loading Graph</h1>
                }
            </div >
        )
    }
}

export default D3Test;