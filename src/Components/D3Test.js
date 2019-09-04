import React, { Component } from 'react';
import RouteManager from './RouteManager';
const axios = require('axios');

class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [],
            ohsGames: {
                routes: [
                    'stackedBarChutes',
                    'stackedBarFletcher',
                    'stackedBarMarie',
                    'stackedBarVortex',
                    'stackedBarDorian',
                ]
            },
            ohsStories: { 
                routes: [
                    'listMostCompleted',
                    'listMostStarted'
                ]
            },
            omhof: {
                routes: [
                    'listWeekAwards',
                    'awardOfTheDay',
                ]
            },
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
        let ohsQuery = ;
        axios.get(ohsQuery).then((response) => {
            console.log(response)
            let ohsGames = [];
            let ohsStories = [];
            // ohsGames needs to be a array of object filled with day, started, finished porperties
            // ohsStories needs to be a array of object filled with day, started, finished porperties
            const ohs = response.data; // {{[]},{[]},{[]}}
            const ohsKeys = Object.keys(ohs); // array of key names
            console.log(gamesOhs)
            console.log(ohs);
            
            this.setState({
                data: ohsGames.concat(ohsStories)
            });
            // let omhofQuery = ;
            // axios.get(omhofQuery).then((response) => {
            //     console.log(response);
            //     const omhof = response.data;
            //     if (omhof )
            //     const weekly = (omhof['kiosks-7day'].length = 100);
            //     const daily = (omhof['kiosks-today'].length = 100);

                 
            //     console.log(omhof);
                
            //     this.setState({
            //         data: this.state.data.concat(omhof),
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