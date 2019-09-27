import React, { useState, useEffect } from 'react';
import axios from "axios";
import { timbersQuery, omoQuery, omhofQuery } from '../Constants/ApiCalls';
import RouteManager from './RouteManager';

export default function HooksFetchData() {
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const timberData = (cleanData) => {
        console.log(cleanData)
        let finalTimberData = {}
        let timberDataObj = {}
        let timberData = [];

        cleanData.forEach((c, i) => {
            const currentKeys = Object.keys(c);
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

        timberDataObj.user = timberData.slice(0, 14)
        timberDataObj.top5Emoji = timberData.slice(14, 19)
        timberDataObj.mostPopEmoji = timberData.slice(19, 20)
        timberDataObj.operatingSystem = timberData.slice(20, 29)

        finalTimberData.timberData = timberDataObj

        return finalTimberData;
    }

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const fetchData = async () => {
            try {
                await axios.get(timbersQuery).then((response) => {
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
                        axios.get(omhofQuery).then((response) => {
                            const omhofResponse = response.data;
                            console.log(omhofResponse)
                            let filteredOmhof = (dataKey) => {
                                let temp = []
                                let final = []
                                Object.keys(omhofResponse[dataKey]).forEach((e) => {
                                    if (omhofResponse[dataKey][e]['page_path'] === '/detail') {
                                        omhofResponse[dataKey][e]['page_title'] = omhofResponse[dataKey][e]['page_title'].replace(/[^\w_]/g, " ");

                                        temp.push(omhofResponse[dataKey][e])
                                    }
                                })

                                // need values full array for this
                                let allTitleValues = temp.map((c) => {
                                    return [...Object.values(c)]
                                })


                                temp.reduce((acc, curr, ind, src) => {

                                    let currentHostName = curr['hostname']
                                    let currentTitle = curr['page_title']
                                    if (Object.values(acc).indexOf(currentTitle) > 0 && Object.values(acc).indexOf(currentHostName) < 0) {
                                        acc['count'] = parseInt(acc['count']) + parseInt(curr['count'])
                                        final.push(acc)
                                    }
                                    return curr
                                })
                                return final;
                            }

                            let omhof = {
                                weekly: filteredOmhof('kiosks-7day'),
                                daily: filteredOmhof('kiosks-today')
                            }
                            console.log(omhof)
                            let weeklyData = { omoData };
                            Object.assign(weeklyData, { omhof })
                            Object.assign(weeklyData, timberData(cleanData))

                            setData(weeklyData);
                            setLoaded(true);
                        })
                    })
                })
            } catch (error) {
                if (axios.isCancel(error)) {
                    throw new Error("Cancelled Request")
                } else {
                    throw error;
                }
            }
        };

        fetchData();
        return () => {
            source.cancel();
        };
    }, [])

    return (
        <>
            {
                loaded ? <RouteManager stateHelper={data} /> : <h1>Loading. . .</h1>
            }
        </>
    )
}
