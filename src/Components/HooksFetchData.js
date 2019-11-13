import React, { useState, useEffect } from 'react';
import axios from "axios";
import { timbersQuery, omoQuery, omhofQuery } from '../Constants/ApiCalls';
import RouteManager from './RouteManager';

export default function HooksFetchData() {
    const [data, setData] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const timberData = (cleanData) => {
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
        if (cleanData[0]['ga:userType'].length === 14) {
            timberDataObj.user = timberData.slice(0, 14)
            timberDataObj.top5Emoji = timberData.slice(14, 19)
            timberDataObj.mostPopEmoji = timberData.slice(19, 20)
            timberDataObj.operatingSystem = timberData.slice(20)
        } else if (cleanData[0]['ga:userType'].length === 13) {
            timberDataObj.user = timberData.slice(0, 13)
            timberDataObj.top5Emoji = timberData.slice(13, 18)
            timberDataObj.mostPopEmoji = timberData.slice(18, 19)
            timberDataObj.operatingSystem = timberData.slice(19)
        } else if (cleanData[0]['ga:userType'].length === 12) {
            timberDataObj.user = timberData.slice(0, 12)
            timberDataObj.top5Emoji = timberData.slice(12, 17)
            timberDataObj.mostPopEmoji = timberData.slice(17, 18)
            timberDataObj.operatingSystem = timberData.slice(18)
        }
        finalTimberData.timberData = timberDataObj
        return finalTimberData;
    }

    const setDayOfWeek = (dateStr) => {
        let date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short' });
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
                            weeklyStories[c + "weeklyStories"] = omoData[c].stories.reduce((curr, acc, ind, src) => {
                                tempStory += parseInt(curr.finished);
                                acc.weekFinished = tempStory + parseInt(acc.finished);
                                if (ind === 1) {
                                    curr.day = setDayOfWeek(curr.day);
                                }
                                src[ind].day = setDayOfWeek(src[ind].day);
                                return acc
                            })
                            weeklyGames[c + "weeklyGames"] = omoData[c].finishedGames.reduce((curr, acc, ind, src) => {
                                tempGame += parseInt(curr.finished);
                                acc.weekFinished = tempGame + parseInt(acc.finished);
                                if (ind === 1) {
                                    curr.day = setDayOfWeek(curr.day);
                                }
                                src[ind].day = setDayOfWeek(src[ind].day);
                                return acc
                            })
                            return weeklyGames
                        })

                        omoKeys.map((c) => {
                            let valueToFetch = omoData[c].finishedGames.length - 1;
                            let weekFinished = omoData[c].finishedGames[valueToFetch].weekFinished;
                            return tempObj[c] = { weekFinished }
                        })
                        console.log(omoData);
                        axios.get(omhofQuery).then((response) => {
                            const omhofResponse = response.data;
                            //{outerKey:dataKey:[{someKey: dataValue, kvpToClean: *^*@FOO@@},{..}], outerKey:dataKey:[{},{}]}
                            //sort by value that exists, then remove special characters from a value with optional param
                            let getRelevantData = (outerKey, dataKey, dataValue, kvpToClean = false) => {
                                let temp = []
                                Object.keys(omhofResponse[outerKey]).forEach((e) => {
                                    if (omhofResponse[outerKey][e][dataKey] === dataValue) {
                                        temp.push(omhofResponse[outerKey][e])
                                    }
                                    if (kvpToClean) {
                                        omhofResponse[outerKey][e][kvpToClean] = omhofResponse[outerKey][e][kvpToClean].replace(/[^\w_]/g, " ");
                                    }
                                })
                                return temp
                            }
                            //takes array of objects and looks for kvp's that are duplicated and removes from the top
                            let combineDuplicates = (arrayOfObjs, duplicateCheck) => {
                                let returnArray = [];
                                let objectCheck = {};

                                for (let object in arrayOfObjs) {
                                    objectCheck[arrayOfObjs[object][duplicateCheck]] = arrayOfObjs[object];
                                }
                                for (let object in objectCheck) {
                                    returnArray.push(objectCheck[object]);
                                }
                                return returnArray;
                            }
                            //combines duplicate objects when filterKey values are the same, then adds together the addition keys as ints, removes the duplicate objs return decsending order
                            let combineOmhof = (originalArray, filterKey, additionKey) => {
                                let tempArray = [];
                                let returnArray = [];

                                originalArray.map((c) => {
                                    return tempArray.push(Object.values(c))
                                })
                                tempArray.map((c, i) => {
                                    let indexOfFilter = c.indexOf(originalArray[i][filterKey]);
                                    let indexOfAdd = c.indexOf(originalArray[i][additionKey]);
                                    if (Object.is(originalArray[i][filterKey], c[indexOfFilter])) {
                                        originalArray[i][additionKey] = parseInt(originalArray[i][additionKey]) + parseInt(c[indexOfAdd])
                                        return returnArray[i] = originalArray[i]
                                    }
                                    return returnArray
                                })
                                //reverse order
                                returnArray.sort((a, b) => (a[additionKey] < b[additionKey]) ? -1 : ((a[additionKey] > b[additionKey]) ? 1 : 0));
                                //remove duplicates
                                returnArray = combineDuplicates(returnArray, filterKey)
                                //return ascending order
                                return returnArray.sort((a, b) => (b[additionKey] < a[additionKey]) ? -1 : ((a[additionKey] > b[additionKey]) ? 1 : 0));
                            }

                            let omhof = {
                                weekly: getRelevantData('kiosks-7day', "page_path", "/detail", "page_title"),
                                daily: getRelevantData('kiosks-today', "page_path", "/detail", "page_title")
                            }
                            omhof.weekly = combineOmhof(omhof.weekly, 'page_title', 'count');
                            omhof.daily = combineOmhof(omhof.daily, 'page_title', 'count');

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
