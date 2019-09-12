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

    // makeTimberGraphReady = (data) => {
    //   data.map((c,i,a) => {
    //       let currentKeys = Object.keys(c) //keys[i] = ga:
    //       currentKeys.forEach((curr, j) => {
    //           let currentDataArray = data[i][curr];
    //           console.log(currentDataArray);
    //         for (let k = 0; k < currentDataArray.length; k++) {
    //            console.log(currentDataArray[k]);
    //         } 
    //       })
    //   })
    // }

    makeTimberGraphable = (data) => {
        let timberData = [];
        data.map((c,i,a) => { 
            let currentKeys = Object.keys(c); // length = 4
            let objsToMake = data[i][currentKeys[0]].length; 
            for (let k = 0; k < objsToMake; k++) {
                let timberDataObj = {};
                currentKeys.forEach((curr, j) => {
                    timberDataObj[curr] = c[curr][k]
                    console.log(timberDataObj);
                })
                //push timberObj to timberdata
            }
            
           
            
            // for (let k = 0;  )
        })
    }



    fetchWeatherData = () => {
        let timbersQuery = 'http://sticky-data.local:8888/projects-dash/?project=timbers';
        axios.get(timbersQuery).then((response) => {
            console.log(response.data)
            let allKeys = Object.keys(response.data);
            //dataset as {{cols:[keys],rows:[values]}} to [{key:[values]},]
            let cleanData = allKeys.map((c) => {
                let timberData = {}
                let currentRows = response.data[`${c}`].rows;
                let currentCols = response.data[`${c}`].cols;
                currentCols.forEach((curr, i) => {
                    timberData[curr] = [];
                    for (let j = 0; j <= currentRows.length - 1; j++) {
                        timberData[curr].push(currentRows[j][i])
                    }
                    return timberData
                })
                return timberData
            })
           this.makeTimberGraphable(cleanData);
        })
        let omoQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omo';
        axios.get(omoQuery).then((response) => {
            const omo = response.data;
          
            let omhofQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omhof';
            axios.get(omhofQuery).then((response) => {
                const omhof = response.data;
               
                let omhofRawWeeklyData = {}
                omhofRawWeeklyData.weekly = new Object(omhof['kiosks-7day'])
                let omhofRawDailyData = {}
                omhofRawDailyData.daily = new Object(omhof['kiosks-today'])
                const weeklyData = Object.values(omo);
                //weeklyData[x] happens for each route position 
                //since omhof routes each only have 1 route they only need to live inside the 0 position in the prop data to routemanager
                this.setState({
                    data: Object.assign(weeklyData[0], omhofRawWeeklyData),
                    data: Object.assign(weeklyData[0], omhofRawDailyData),
                    data: weeklyData
                });
                this.setState({ loaded: true })
            })
        })
    }

    componentDidMount() {
        this.fetchWeatherData()
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