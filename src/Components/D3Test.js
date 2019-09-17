import React, { Component } from 'react';
import RouteManager from './RouteManager';
import { async } from 'q';
const axios = require('axios');

class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            data: {},
            omo: {
                routes: [
                    //         'stackedGameChutes',
                    //         'stackedGameFletcher',
                    //         'stackedGameVortex',
                    //         'stackedGameMarie',
                    //         // 'stackedBarDorian',
                    //         'stackedStoryChutes',
                    //         'stackedStoryFletcher',
                    //         'stackedStoryVortex',
                    //         'stackedStoryMarie',
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
            // timbers: {
            //     routes: [
            //         'listWeekTopEmojis',
            //         'stackedBarNewVReturn',
            //         'mostPopularEmoji',
            //         'mobileIosVsAndroid'
            //     ]
            // },
        }
    }

    cleanData = (dataKeys, responseData) => {
        let cleanedData = {}
        dataKeys.map((c) => {
            let tempData = {}
            let currentRows = responseData[`${c}`].rows;
            let currentCols = responseData[`${c}`].cols;
            currentCols.forEach((curr, i) => {
                tempData[curr] = [];
                for (let j = 0; j <= currentRows.length - 1; j++) {
                    tempData[curr].push(currentRows[j][i]);
                }
                if (currentRows.length === 0) {
                    tempData[curr].push("none")
                }
                return tempData
            })
            return Object.assign(cleanedData, tempData);
        })
        return cleanedData;
    }

    async componentDidMount() {
        let timbersQuery = 'http://sticky-data.local:8888/projects-dash/?project=timbers';
        let omoQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omo';
        let omhofQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omhof';
        let weeklyData = {}
        try {
            const omo = await axios.get(omoQuery).then((response) => {
                let tempData = response.data
                weeklyData.omo = tempData
            })
        } catch (error) {
            console.log(error)
        }
        this.setState({
            data: weeklyData
        });
        console.log(this.state.data)
        let finalTimberData = {}
        try {
            const timbers = await axios.get(timbersQuery).then((response) => {
                let timberResponse = response.data;
                let allKeys = Object.keys(response.data);
                return this.cleanData(allKeys, timberResponse);
            })
            let timberData = (cleanTimber) => {
                console.log(cleanTimber)
                let timberDataObj = {}
                let timberData = [];
                //make 4 arrays for each ending number
                let timberUser = []
                let timberTop5Emoji = []
                let timberMostPopular = []
                let timberOS = []

                cleanTimber.forEach((c, i) => {
                    let currentKeys = Object.keys(c);
                    let objsToMake = cleanTimber[i][currentKeys[0]].length;
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
                timberUser = timberData.slice(0, 13)
                timberTop5Emoji = timberData.slice(13, 18)
                timberMostPopular = timberData.slice(18, 19)
                timberOS = timberData.slice(19, 28)


                timberDataObj.user = timberUser
                timberDataObj.top5Emoji = timberTop5Emoji
                timberDataObj.mostPopEmoji = timberMostPopular
                timberDataObj.operatingSystem = timberOS

                finalTimberData.timberData = timberDataObj

                return finalTimberData;
            }
        timberData(timbers);
        } catch (error) {
            console.log(error)
        }

        this.setState({
            data: Object.assign(weeklyData, finalTimberData)
        })
        console.log(this.state.data)
        try {
            const omhof = await axios.get(omhofQuery).then((response) => {
                const omhof = response.data;
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
                this.setState({
                    data: Object.assign(weeklyData, omhofRawDailyData),
                    data: Object.assign(weeklyData, omhofRawWeeklyData)
                })

                // this.setState({ loaded: true })
            })

        } catch (error) {
            console.log(error)
            // Object.assign(weeklyData, timberData(cleanTimber))
        }
    }



    // fetchGraphData =  () => {
    // let timbersQuery = 'http://sticky-data.local:8888/projects-dash/?project=timbers';
    //     axios.get(timbersQuery).then((response) => {
    //         console.log("timber data", response.data)
    //         let timberResponse = await response.data;
    //         let allKeys = Object.keys(response.data);
    //         // let cleanData = allKeys.map((c) => {
    //         //     let tempData = {}
    //         //     let currentRows = response.data[`${c}`].rows;
    //         //     let currentCols = response.data[`${c}`].cols;
    //         //     currentCols.forEach((curr, i) => {
    //         //         tempData[curr] = [];
    //         //         for (let j = 0; j <= currentRows.length - 1; j++) {
    //         //             tempData[curr].push(currentRows[j][i]);
    //         //         }
    //         //         if (currentRows.length === 0 ){
    //         //             tempData[curr].push("none")
    //         //         }
    //         //         return tempData
    //         //     })
    //         //     return tempData
    //         // })
    //         let cleanTimber = await this.cleanData(allKeys, timberResponse)
    //         console.log(cleanTimber)

    //         let timberData = (cleanData) => {
    //             let finalTimberData = {}
    //             let timberDataObj = {}
    //             let timberData = [];

    //             //make 4 arrays for each ending number
    //             let timberUser = []
    //             let timberTop5Emoji = []
    //             let timberMostPopular = []
    //             let timberOS = []

    //             cleanData.forEach((c, i) => {
    //                 let currentKeys = Object.keys(c);
    //                 let objsToMake = cleanData[i][currentKeys[0]].length;
    //                 //need to account for when an emoji has not yet been used today!!
    //                 for (let k = 0; k < objsToMake; k++) {
    //                     let timberDataObj = {};
    //                     currentKeys.forEach((curr) => {
    //                         if (curr === 'ga:userType' && c[curr][k] === 'New Visitor') {
    //                             timberDataObj.new = c[curr][k];
    //                             timberDataObj.return = null;
    //                         } else if (curr === 'ga:userType' && c[curr][k] === 'Returning Visitor') {
    //                             timberDataObj.new = null;
    //                             timberDataObj.return = c[curr][k];
    //                         } else if (curr === 'ga:operatingSystem' && c[curr][k] === 'iOS') {
    //                             timberDataObj.iOS = c[curr][k]
    //                             timberDataObj.android = null;
    //                         } else if (curr === 'ga:operatingSystem' && c[curr][k] === 'Android') {
    //                             timberDataObj.iOS = null;
    //                             timberDataObj.android = c[curr][k];
    //                         } else
    //                             if (curr === 'ga:sessions' && timberDataObj.new != null) {
    //                                 timberDataObj.new = c[curr][k]
    //                             } else if (curr === 'ga:sessions' && timberDataObj.new === null) {
    //                                 timberDataObj.return = c[curr][k]
    //                             }
    //                         //adds i for cases where names are the same 
    //                         timberDataObj[curr + i] = c[curr][k]
    //                     })
    //                     timberData.push(timberDataObj);
    //                 }
    //                 return timberData
    //             })

    //             //issue with response-users-newusers inconsistant response length where a day can be cut off
    //             timberUser = timberData.slice(0, 13)
    //             timberTop5Emoji = timberData.slice(13, 18)
    //             timberMostPopular = timberData.slice(18, 19)
    //             timberOS = timberData.slice(19, 28)


    //             timberDataObj.user = timberUser
    //             timberDataObj.top5Emoji = timberTop5Emoji
    //             timberDataObj.mostPopEmoji = timberMostPopular
    //             timberDataObj.operatingSystem = timberOS

    //             finalTimberData.timberData = timberDataObj

    //             return finalTimberData;
    //         }
    // let omoQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omo';
    // axios.get(omoQuery).then((response) => {
    //     const omoData = response.data;
    //     let weeklyOmoData = Object.entries(omoData).map((c, i, a) => {
    //         console.log(c)
    //         return c
    //     })
    //     console.log(weeklyOmoData)
    // let omhofQuery = 'http://sticky-data.local:8888/projects-dash/analytics/omhof';
    // axios.get(omhofQuery).then((response) => {
    //     const omhof = response.data;
    //     let filteredOmhof = (dataKey) => {
    //         let temp = []
    //         Object.keys(omhof[dataKey]).forEach((e, i) => {
    //             if (omhof[dataKey][e]['page_path'] === '/detail') {
    //                 omhof[dataKey][e]['page_title'] = omhof[dataKey][e]['page_title'].replace(/[^\w_]/g, " ");
    //                 temp.push(omhof[dataKey][e])
    //             }
    //         })
    //         return temp;
    //     }

    //     let omhofRawWeeklyData = {
    //         weekly: filteredOmhof('kiosks-7day'),
    //     }

    //     let omhofRawDailyData = {
    //         daily: filteredOmhof('kiosks-today'),
    //     }

    //     let weeklyData = { omoData };
    //     Object.assign(weeklyData, omhofRawDailyData)
    //     Object.assign(weeklyData, omhofRawWeeklyData)
    //     Object.assign(weeklyData, timberData(cleanTimber))

    //     this.setState({
    //         data: weeklyData
    //     });
    //     this.setState({ loaded: true })
    // })
    // })
    // })
    // }

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