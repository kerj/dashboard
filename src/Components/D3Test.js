import React, { Component } from 'react';
import RouteManager from './RouteManager';
import { tsMethodSignature } from '@babel/types';
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
        let timbersQuery = 'http://sticky-data.local:8888/projects-dash/?project=timbers';
        axios.get(timbersQuery).then((response) => {
            console.log(response.data)
            let allKeys = Object.keys(response.data);
            let data = allKeys.map((c, i, a) => {
                let currentKeys = response.data[allKeys[i]].cols;
                let currentDataset = response.data[allKeys[i]].rows;
                console.log(currentKeys);//ga:
                console.log(currentDataset);//array of raw data
                let timberObj = {}
                for (let i = 0, j = 0; i < currentDataset.length || !j === ; i++) {
                    currentKey = currentKeys[j]
                    currentData = response.data[currentKeys].rows[i];
                    timberObj = {
                        currentKey: []
                    }
                    if (i === currentData.length) {
                        j++
                        i = 0
                    }
                    console.log(timberObj);//{response-op-sys:}
                    timberObj[currentKeys].push(currentData)
                }
                return timberObj
            })
            console.log(data)
            // let data = timbersKeys.map((c, i, a) => {
            //     let currentSet = response.data[`${c}`].rows;
            //     let currentKey = response.data[`${c}`].cols;
            //     let temp = {};
            //     currentKey.map((k, o) => {
            //         a[k + i] = []
            //         for (let j = 0; j <= currentSet.length - 1; j++) {
            //             let iterationSet = [...currentSet[j]];
            //             a[k + i].push(iterationSet[o]);
            //             temp[a[k+i]] = a[k+i];
            //         }
            //         return temp
            //     })
            //     //get data table by rows and columns as arrays
            //     return a
            // })
            // console.log(data)
        })
        // let omoQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omo';
        // axios.get(omoQuery).then((response) => {
        //     const omo = response.data;
        //     let omhofQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omhof';
        //     axios.get(omhofQuery).then((response) => {
        //         const omhof = response.data;
        //         let omhofRawWeeklyData = {}
        //         omhofRawWeeklyData.weekly = new Object(omhof['kiosks-7day'])
        //         let omhofRawDailyData = {}
        //         omhofRawDailyData.daily = new Object(omhof['kiosks-today'])
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