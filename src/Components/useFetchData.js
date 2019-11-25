import React, { useState, useEffect, useCallback } from 'react';
import axios from "axios";
import { timbersQuery, omoQuery, omhofQuery } from '../Constants/ApiCalls';

export default function useFetchData() {
    const [data, setData] = useState({retrievedOn: ''});
    const [isLoading, setIsLoading] = useState(false)

    // TODO: Use an argument passed into this hook to grab from a URL.  Just triggers updates for now.
    const [url, setUrl] = useState('')

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
        //replace - for / so the actual date is returned
        let today = new Date();
        let newDate = new Date(dateStr.replace(/-/g, '\/'));
        return  today.toLocaleDateString('en-US') === newDate.toLocaleDateString('en-US') ? 'Today' : newDate.toLocaleDateString('en-US', { weekday: 'short' });
    }

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const fetchData = async () => {
            setIsLoading(true)
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
                            weeklyStories[c + "weeklyStories"] = omoData[c].stories.reduce((acc, curr, ind, src) => {

                                tempStory += parseInt(acc.finished);
                                curr.weekFinished = tempStory + parseInt(curr.finished);
                                if (ind === 1) {
                                    acc.day = setDayOfWeek(acc.day);
                                } else if (ind === src.length - 1) {
                                    acc.day = setDayOfWeek(acc.day);
                                    curr.day = setDayOfWeek(curr.day);
                                } else {
                                    acc.day = setDayOfWeek(acc.day);
                                }

                                return curr
                            })
                            weeklyGames[c + "weeklyGames"] = omoData[c].finishedGames.reduce((acc, curr, ind, src) => {
                                tempGame += parseInt(acc.finished);
                                curr.weekFinished = tempGame + parseInt(curr.finished);
                                if (ind === 1) {
                                    acc.day = setDayOfWeek(acc.day);
                                } else if (ind === src.length - 1) {
                                    acc.day = setDayOfWeek(acc.day);
                                    curr.day = setDayOfWeek(curr.day);
                                } else {
                                    acc.day = setDayOfWeek(acc.day);
                                }
                                return curr
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
                            //{outerKey:dataKey:[{someKey: dataValue, kvpToClean: *^*@FOO@@},{..}], outerKey:dataKey:[{},{}]}
                            //sort by value that exists, then remove special characters from a value with optional param
                            let getRelevantData = (outerKey, dataKey, dataValue, kvpToClean = false) => {
                                let temp = []
                                Object.keys(omhofResponse[outerKey]).forEach((e) => {
                                    if (omhofResponse[outerKey][e][dataKey] !== dataValue) {
                                        return
                                    }
                                    temp.push(omhofResponse[outerKey][e])
                                    if (kvpToClean) {
                                        let awardInfo = _processTitle(omhofResponse[outerKey][e][kvpToClean])
                                        omhofResponse[outerKey][e][kvpToClean + '-cleaned'] = `${awardInfo['name']} (${awardInfo['year']})`
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
                                returnArray.sort((a, b) => (b[additionKey] < a[additionKey]) ? -1 : ((a[additionKey] > b[additionKey]) ? 1 : 0));
                                //change page_path field to type of award for scss class
                                returnArray.map((c) => {
                                    return c['page_title'].includes('Artist') ? c['page_path'] = 'artist' :
                                        c['page_title'].includes('Album') ? c['page_path'] = 'album' :
                                            c['page_title'].includes('Industry') ? c['page_path'] = 'hof' :
                                                c['page_title'].includes('Band') ? c['page_path'] = 'artist' : c['page_path'] = 'hof'
                                })
                                return returnArray
                            }

                            let omhof = {
                                weekly: getRelevantData('kiosks-7day', "page_path", "/detail", "page_title"),
                                daily: getRelevantData('kiosks-today', "page_path", "/detail", "page_title")
                            }
                            omhof.weekly = combineOmhof(omhof.weekly, 'page_title', 'count');
                            omhof.daily = combineOmhof(omhof.daily, 'page_title', 'count');

                            omhof.weekly.length = 5;
                            omhof.daily.length = 5;


                            let weeklyData = { omoData };
                            Object.assign(weeklyData, { omhof })
                            Object.assign(weeklyData, timberData(cleanData))

                            weeklyData.retrievedOn = Date.now()
                            setData(weeklyData);
                            setIsLoading(false)
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
    }, [url])

    const fetchData = useCallback(() => {
        // Just trigger a value change so that fetching happens again.
        setUrl(Math.random())
    }, [setUrl])
    return [{ data, isLoading }, fetchData];
}

function _processTitle(fulltitle) {
    const split= fulltitle.split('-:+:-')

    return {
        year: split[0],
        award: split[1],
        name: _truncateName(split[2]) }
}

function _truncateName (name) {
    const limit = 15
    return name.length > limit ? name.substr(0, limit - 1) + '…' : name
}
