import React, { Component } from 'react';
import RouteManager from './RouteManager';
const axios = require('axios');

class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            data: [],
            omoGames: {
                routes: [
                    'stackedBarChutes',
                    'stackedBarFletcher',
                    'stackedBarVortex',
                    'stackedBarMarie',
                    // 'stackedBarDorian',
                ]
            },
            omoStories: { 
                routes: [
                    'listMostCompleted',
                    'listMostStarted'
                ]
            },
            // omhof: {
            //     routes: [
            //         'listWeekAwards',
            //         'awardOfTheDay',
            //     ]
            // },
            // timbers: {
            //     routes: [
            //         'listWeekTopEmojis',
            //         'stackedBarNewVReturn',
            //         'mostPopularEmoji',
            //         'mobileIosVsAndroid'
            //     ]
            // }
        }
    }

    fetchWeatherData = () => {
        let omoQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omo';
        axios.get(omoQuery).then((response) => {
            console.log(response)
        
            const omo = response.data; // {{[0],[1],[day]},{[0],[1],[day]},{[0],[1],[day]}} = [{[0],[1],[day]}...]
            //     ohsKeys = Object.keys(ohs); // array of key names
                
            // ohsKeys.map((o,i,a) => {
            //     o[i]['']
            // })

            // console.log(gamesOhs)
            // console.log(ohs);
            
            this.setState({
                // data: ohsGames.concat(ohsStories)
                data: omo
            });
            this.setState({ loaded : true})
            console.log(this.state.data);
            
            // let omhofQuery = ;
            // axios.get(omhofQuery).then((response) => {
            //     console.log(response);
            //     const omhof = response.data;
            //     if (omhof )
            //     const weekly = (omhof['kiosks-7day'].length = 100);
            //     const daily = (omhof['kiosks-today'].length = 100);

                 
            //  
            //    console.log(omhof);
                
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
                this.state.loaded ? <RouteManager stateHelper={this.state} /> : <h1>Loading Graph</h1>
            }
            </div >
        )
    }
}

export default D3Test;