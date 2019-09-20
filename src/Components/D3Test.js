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
                    'OHS-CHUTES GAME',
                    'OHS-FLECTCHER GAME',
                    'OHS-VORTEX GAME',
                    'OHS-MARIE GAME',
            //         // 'stackedBarDorian',
                    'OHS-CHUTES STORY',
                    'OHS-FLECTCHER STORY',
                    'OHS-VORTEX STORY',
                    'OHS-MARIE STORY',
                    'OHS-MOST READ TODAY',
                    'OHS-WEEKLY STORIES READ'
                ]
            },
            omhof: {
                routes: [
                    'OMHOF TOP AWARDS',
                    'OMHOF AWARD OF THE DAY',
                ]
            },
            timbers: {
                routes: [
                    'TIMBERS WEEKLY TOP EMOJIS',
                    'NEW VS. RETURNING VISITORS',
                    'MOST POPULAR EMOJI TODAY',
                    'MOBILE OPERATING SYSTEMS'
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
                //problem when no new, or returning visisors have used this
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
                let omoKeys = Object.keys(omoData)
                let weeklyGames = {}
                let weeklyStories = {}
                let tempObj = {}
                omoKeys.map((c) => {
                    let tempStory = 0;
                    let tempGame = 0;
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
                    return weeklyGames
                })

                omoKeys.map((c) => {
                    let valueToFetch = omoData[c].finishedGames.length - 1;
                    let weekFinished = omoData[c].finishedGames[valueToFetch].weekFinished;
                    return tempObj[c] = { weekFinished }
                })

                let omhofQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omhof';
                axios.get(omhofQuery).then((response) => {
                    const omhofResponse = response.data;
                    let filteredOmhof = (dataKey) => {
                        let temp = []
                        Object.keys(omhofResponse[dataKey]).forEach((e, i) => {
                            if (omhofResponse[dataKey][e]['page_path'] === '/detail') {
                                omhofResponse[dataKey][e]['page_title'] = omhofResponse[dataKey][e]['page_title'].replace(/[^\w_]/g, " ");
                                temp.push(omhofResponse[dataKey][e])
                            }
                        })
                        return temp;
                    }
                    let omhof = {
                        weekly: filteredOmhof('kiosks-7day'),
                        daily: filteredOmhof('kiosks-today')
                    }
                    let weeklyData = { omoData };
                    Object.assign(weeklyData, {omhof})
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