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

    makeTimberGraphable = (cleanedData) => {
        let timberDataObj = {}
        let timberData = [];
        cleanedData.map((c, i) => {
            let currentKeys = Object.keys(c);
            let objsToMake = cleanedData[i][currentKeys[0]].length;
            for (let k = 0; k < objsToMake; k++) {
                let timberDataObj = {};
                currentKeys.forEach((curr) => {
                    if (curr === 'ga:userType' && c[curr][k] === 'New Visitor') {
                        timberDataObj.new = c[curr][k];
                        timberDataObj.return = null;
                    } else if (curr === 'ga:userType' && c[curr][k] === 'Returning Visitor'){
                        timberDataObj.new = null;
                        timberDataObj.return = c[curr][k];
                    } else if ( curr === 'ga:operatingSystem' && c[curr][k] === 'iOS') {
                        timberDataObj.iOS = c[curr][k]
                        timberDataObj.android = null;
                    }else if ( curr === 'ga:operatingSystem' && c[curr][k] === 'Android') {
                        timberDataObj.iOS = null;
                        timberDataObj.android = c[curr][k];
                    }else
                    timberDataObj[curr + i] = c[curr][k]
                    //adds i for cases where names are the same 
                })
                timberData.push(timberDataObj);
            }
            return timberData
        })
        //make 4 arrays for each ending number
        let timberUser = []
        let timberTop5Emoji = []
        let timberMostPopular = []
        let timberOS = []

        timberUser = timberData.slice(0, 14)
        timberTop5Emoji = timberData.slice(14, 19)
        timberMostPopular = timberData.slice(19, 20)
        timberOS = timberData.slice(20, 29)

        timberDataObj.user = timberUser
        timberDataObj.top5Emoji = timberTop5Emoji
        timberDataObj.mostPopEmoji = timberMostPopular
        timberDataObj.operatingSystem = timberOS

        return timberDataObj;
    }

    fetchGraphData = () => {
        let timbersQuery = 'http://sticky-data.local:8888/projects-dash/?project=timbers';
        axios.get(timbersQuery).then((response) => {
            let allKeys = Object.keys(response.data);
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

            let timberData = (cleanData) => {
                let finalTimberData = {}
                let timberDataObj = {}
                let timberData = [];
                cleanData.map((c, i) => {
                    let currentKeys = Object.keys(c);
                    let objsToMake = cleanData[i][currentKeys[0]].length;
                    for (let k = 0; k < objsToMake; k++) {
                        let timberDataObj = {};
                        currentKeys.forEach((curr) => {
                            if (curr === 'ga:userType' && c[curr][k] === 'New Visitor') {
                                timberDataObj.new = c[curr][k];
                                timberDataObj.return = null;
                            } else if (curr === 'ga:userType' && c[curr][k] === 'Returning Visitor'){
                                timberDataObj.new = null;
                                timberDataObj.return = c[curr][k];
                            } else if ( curr === 'ga:operatingSystem' && c[curr][k] === 'iOS') {
                                timberDataObj.iOS = c[curr][k]
                                timberDataObj.android = null;
                            }else if ( curr === 'ga:operatingSystem' && c[curr][k] === 'Android') {
                                timberDataObj.iOS = null;
                                timberDataObj.android = c[curr][k];
                            }else
                            if ( curr === 'ga:sessions' && timberDataObj.new != null){
                                timberDataObj.new = c[curr][k]
                            }else if (curr === 'ga:sessions' && timberDataObj.new === null) {
                                timberDataObj.return = c[curr][k]
                            }
                            //adds i for cases where names are the same 
                            timberDataObj[curr + i] = c[curr][k]
                        })
                        timberData.push(timberDataObj);
                    }
                    return timberData
                })
                //make 4 arrays for each ending number
                let timberUser = []
                let timberTop5Emoji = []
                let timberMostPopular = []
                let timberOS = []

                timberUser = timberData.slice(0, 14)
                timberTop5Emoji = timberData.slice(14, 19)
                timberMostPopular = timberData.slice(19, 20)
                timberOS = timberData.slice(20, 29)

                timberDataObj.user = timberUser
                timberDataObj.top5Emoji = timberTop5Emoji
                timberDataObj.mostPopEmoji = timberMostPopular
                timberDataObj.operatingSystem = timberOS

                finalTimberData.timberData = timberDataObj

                return finalTimberData;
            }
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
                        data: Object.assign(weeklyData[0], timberData(cleanData)),
                        data: Object.assign(weeklyData[1], timberData(cleanData)),
                        data: Object.assign(weeklyData[2], timberData(cleanData)),
                        data: Object.assign(weeklyData[3], timberData(cleanData)),
                        data: weeklyData
                    });
                    this.setState({ loaded: true })
                    console.log(this.state.data)
                })
            })
        })
    }

    componentDidMount() {
        this.fetchGraphData()
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