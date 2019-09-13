import React, { Component } from 'react';
import RouteManager from './RouteManager';
const axios = require('axios');

class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            data: {},
            omo: {
                routes: [
                    'stackedGameChutes',
                    'stackedGameFletcher',
                    'stackedGameVortex',
                    'stackedGameMarie',
                    // 'stackedBarDorian',
                    'stackedStoryChutes',
                    'stackedStoryFletcher',
                    'stackedStoryVortex',
                    'stackedStoryMarie',
                    'listMostCompleted',
                    'listWeeklyTotal'
                ]
            },
            omhofWeekly: {
                routes: [
                    'listWeekAwards',
                ]
            },
            omhofDaily: {
                routes: [
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
                            } else if (curr === 'ga:userType' && c[curr][k] === 'Returning Visitor') {
                                timberDataObj.new = null;
                                timberDataObj.return = c[curr][k];
                            } else if (curr === 'ga:operatingSystem' && c[curr][k] === 'iOS') {
                                timberDataObj.iOS = c[curr][k]
                                timberDataObj.android = null;
                            } else if (curr === 'ga:operatingSystem' && c[curr][k] === 'Android') {
                                timberDataObj.iOS = null;
                                timberDataObj.android = c[curr][k];
                            } else
                                if (curr === 'ga:sessions' && timberDataObj.new != null) {
                                    timberDataObj.new = c[curr][k]
                                } else if (curr === 'ga:sessions' && timberDataObj.new === null) {
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
                console.log(finalTimberData)
                return finalTimberData;
            }
            let omoQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omo';
            axios.get(omoQuery).then((response) => {
                const omoData = response.data;
                let omhofQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omhof';
                axios.get(omhofQuery).then((response) => {
                    const omhof = response.data;
                    let omhofRawWeeklyData = {}
                    omhofRawWeeklyData.weekly = new Object(omhof['kiosks-7day'])
                    let omhofRawDailyData = {}
                    omhofRawDailyData.daily = new Object(omhof['kiosks-today'])
                    const weeklyData = { omoData };
                    console.log(weeklyData)
                    //since omhof routes each only have 1 route/view they only need to live inside the 0 position in the prop data to routemanager
                    //keep this in mind data that has 2,3, or 50 routes/views need to have thier data available in state.data array at that index 
                    this.setState({
                        data: Object.assign(weeklyData, omhofRawWeeklyData),
                        data: Object.assign(weeklyData, omhofRawDailyData),
                        data: Object.assign(weeklyData, timberData(cleanData)),
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