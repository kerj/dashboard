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
            },
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
                        timberData[curr].push(currentRows[j][i]);
                    }
                    if (currentRows.length === 0) {
                        timberData[curr].push("none")
                    }
                    return timberData
                })
                return timberData
            })

            let timberData = (cleanData) => {
                let finalTimberData = {}
                let timberDataObj = {}
                let timberData = [];

                //make 4 arrays for each ending number
                let timberUser = []
                let timberTop5Emoji = []
                let timberMostPopular = []
                let timberOS = []

                cleanData.forEach((c, i) => {
                    let currentKeys = Object.keys(c);
                    let objsToMake = cleanData[i][currentKeys[0]].length;
                    //need to account for when an emoji has not yet been used today!!
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

                //issue with response-users-newusers inconsistant response length where a day can be cut off
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
                const omoData = response.data;
                console.log(omoData)
                let omoKeys = Object.keys(omoData)
                let weeklyGames = {}
                let weeklyStories = {}
                let tempObj = {}
                omoKeys.map((c) => {
                    //c = a property string
                    let tempStory = 0;
                    let tempGame = 0;
                    //sets a new property to weeklystories object = to the tally of complete stories
                    weeklyStories[c + "weeklyStories"] = omoData[c].stories.reduce((curr, acc) => {
                        tempStory += parseInt(curr.finished)
                        acc.weekFinished = tempStory + parseInt(acc.finished)
                        return acc
                    })
                    weeklyGames[c + "weeklyGames"] = omoData[c].finishedGames.reduce((curr, acc) => {
                        tempGame += parseInt(curr.finished)
                        acc.weekFinished = tempGame + parseInt(acc.finished)
                        return acc
                    })
                    return weeklyGames, weeklyStories
                })

                omoKeys.map((c) => {
                    //set to the sum of the weekly stat for that particular game
                    let valueToFetch = omoData[c].finishedGames.length - 1;
                    let weekFinished = omoData[c].finishedGames[valueToFetch].weekFinished;
                    tempObj[c] = { weekFinished }
                })
                // obj w/ kvp's for = game : weeklyTotalCompleteAmount
                console.log(tempObj)
                //== to omoData w/ extra props called weekFinished = the week count to that point
                console.log(weeklyGames, weeklyStories)
                console.log(omoData)
                //Need data to stucture like [{[]},{[]},{[]}]



                let omhofQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omhof';
                axios.get(omhofQuery).then((response) => {
                    const omhof = response.data;
                    // console.log(omhof)

                    let filteredOmhof = (dataKey) => {
                        let temp = []
                        Object.keys(omhof[dataKey]).forEach((e, i) => {
                            if (omhof[dataKey][e]['page_path'] === '/detail') {
                                omhof[dataKey][e]['page_title'] = omhof[dataKey][e]['page_title'].replace(/[^\w_]/g, " ");
                                temp.push(omhof[dataKey][e])
                            }
                        })

                        return temp;
                    }

                    let omhofRawWeeklyData = {
                        weekly: filteredOmhof('kiosks-7day'),
                    }

                    let omhofRawDailyData = {
                        daily: filteredOmhof('kiosks-today'),
                    }

                    let weeklyData = { omoData };
                    Object.assign(weeklyData, omhofRawDailyData)
                    Object.assign(weeklyData, omhofRawWeeklyData)
                    Object.assign(weeklyData, timberData(cleanData))

                    this.setState({
                        data: weeklyData
                    });
                    this.setState({ loaded: true })
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