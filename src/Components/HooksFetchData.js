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
                                // let hofr = [];
                                // let hofl = [];
                                // temp.map((c) => {
                                //    c['hostname'] === "HOFR" ? hofr.push(c) : hofl.push(c)
                                //    console.log(hofr, hofl)
                                // })


                                // temp.reduce((acc, curr, ind, src) => {
                                //     let currentTitle = curr['page_title']
                                //     console.log(Object.values(curr), currentTitle)
                                //     if (Object.values(acc).includes(currentTitle)) {
                                //         acc['count'] = parseInt(acc['count']) + parseInt(curr['count'])
                                //         final.push(acc)
                                //     }
                                //     return curr
                                // })
                                // return final;
                                return temp
                            }




                            let mergeAdd = (propToAdd, ...objects) => {
                                const merged = objects.reduce((a, obj) => {
                                    Object.entries(obj).forEach(([key, val]) => {
                                        if (key === propToAdd) {
                                            a[key] = (parseInt(a[key]) || '') + parseInt(val);
                                        } else { a[key] = a[key] || '' + val }
                                    });
                                    return a;
                                }, {});
                                return Object.fromEntries(
                                    Object.entries(merged).sort(
                                        (a, b) => b[1] - a[1]
                                    )
                                );
                            }


                            let tester = (oArray, keyRef, propToAdd) => {
                                let temp = [];
                                oArray.reduce((a, c) => {
                                    if (a[keyRef] === c[keyRef]) {
                                        temp.push(mergeAdd(propToAdd, a, c))
                                        return c
                                    } else {
                                        temp.push(c)
                                        return c
                                    }
                                })
                                console.log(temp)
                            }

                            // let combineDuplicates = (array, duplicateCheck, valueToCombine) => {
                            //     let returnArray = [];
                            //     let objectCheck = {};

                            //     for (let i in array) {
                            //         objectCheck[array[i][duplicateCheck]] = array[i];
                            //         console.log(array[i]);

                            //     }

                            //     for (let i in objectCheck) {
                            //         returnArray.push(objectCheck[i]);
                            //     }
                            //     return returnArray;
                            // }


                            // let combineDupe = (originalArray, kvpDuplicate, valueToCombine) => {
                            //     let kvpInCheck = originalArray[0];
                            //     let returnArray = [];
                            //     originalArray.filter((ele) => {
                            //         if (kvpInCheck[kvpDuplicate] === ele[kvpDuplicate]) {
                            //             ele[valueToCombine] = parseInt(ele[valueToCombine]) + parseInt(kvpInCheck[valueToCombine])
                            //             ele[valueToCombine].toString();
                            //             kvpInCheck = ele;
                            //             return returnArray.push(kvpInCheck);
                            //         } else {
                            //             kvpInCheck = ele;
                            //             returnArray.push(kvpInCheck);
                            //             return false;
                            //         }
                            //     })
                            //     returnArray.sort((a,b) => (b[valueToCombine] < a[valueToCombine]) ? -1 : ((a[valueToCombine] > b[valueToCombine]) ? 1 : 0));
                            //     console.log(returnArray)
                            // }



                            let splitLeftRight = (arrayToSplit, keyToReference, kvpThatMayDiffer, keyToAddTogether) => {
                                arrayToSplit.sort((a, b) => (b[keyToAddTogether] < a[keyToAddTogether]) ? -1 : ((a[keyToAddTogether] > b[keyToAddTogether]) ? 1 : 0));
                                let left = [];
                                let tempLeft = [];
                                let right = [];
                                let temp = [];
                                arrayToSplit.reduce((a, c) => {
                                    if (a[kvpThatMayDiffer] === c[kvpThatMayDiffer]) {
                                        right.push(a)
                                        return c
                                    } else {
                                        left.push(c)
                                        return a
                                    }
                                })
                                left.sort((a, b) => (b[keyToReference] < a[keyToReference]) ? -1 : ((a[keyToReference] > b[keyToReference]) ? 1 : 0));
                                right.sort((a, b) => (b[keyToReference] < a[keyToReference]) ? -1 : ((a[keyToReference] > b[keyToReference]) ? 1 : 0));
                                for (let i = 0; i < left.length - 1; i++) {
                                    tempLeft.push(mergeAdd(keyToAddTogether, left[i], left[i + 1]));
                                }
                                for (let i = 0; i < right.length; i++) {
                                    temp.push(mergeAdd(keyToAddTogether, tempLeft[i], right[i]));
                                }
                                temp.reduce((a, c, i) => {
                                    if (a[keyToReference] === c[keyToReference]) {
                                        c[keyToAddTogether] = parseInt(a[keyToAddTogether]) + parseInt(c[keyToAddTogether]);
                                        temp.splice(i-1, 1)
                                        return c
                                    } else {
                                        return c
                                    }
                                })
                                return temp.sort((a,b) => (b[keyToAddTogether] < a[keyToAddTogether]) ? -1 : ((a[keyToAddTogether] > b[keyToAddTogether]) ? 1 : 0));
                            }

                            // left.sort((a, b) => (b[keyToAddTogether] < a[keyToAddTogether]) ? -1 : ((a[keyToAddTogether] > b[keyToAddTogether]) ? 1 : 0));
                            // needs to add up counts for duplicate titles in order of high to low



                            // //add up values that have the same keyToReference only works if they are next to each other
                            // left.reduce((acc, curr, ind) => {
                            //     if (curr[keyToReference] === acc[keyToReference]) {
                            //         acc[keyToAddTogether] = parseInt(acc[keyToAddTogether]) + parseInt(curr[keyToAddTogether])
                            //         left.splice(ind, 1);
                            //     }
                            //     return curr
                            // })
                            // console.log(left)

                            // right.sort((a, b) => (b[keyToReference] < a[keyToReference]) ? -1 : ((a[keyToReference] > b[keyToReference]) ? 1 : 0));
                            // right.reduce((acc, curr, ind) => {
                            //     if (curr[keyToReference] === acc[keyToReference]) {
                            //         acc[keyToAddTogether] = parseInt(acc[keyToAddTogether]) + parseInt(curr[keyToAddTogether])
                            //         right.splice(ind, 1);
                            //     }
                            //     return curr
                            // })

                            // right.sort((a, b) => (b[keyToAddTogether] < a[keyToAddTogether]) ? -1 : ((a[keyToAddTogether] > b[keyToAddTogether]) ? 1 : 0));

                            // console.log(left, right)

                            // let final = [];

                            // for (let j = 0; j <= left.length - 1; j++) {
                            //     if (j >= right.length) {
                            //         final.push(left[j]);
                            //     } else {
                            //         if (left[j][keyToReference] === right[j][keyToReference]) {
                            //             left[j][keyToAddTogether] = parseInt(left[j][keyToAddTogether]) + parseInt(right[j][keyToAddTogether])
                            //             final.push(left[j])
                            //         } else {
                            //             final.push(left[j])
                            //         }
                            //     }
                            // }
                            // final.sort((a, b) => b[keyToAddTogether] - a[keyToAddTogether])
                            // return final
                            // }

                            //combine left and right values for omhof this skips some values
                            // let combineLeftRight = (arrayToReduce, keyToReference, kvpThatMayDiffer, keyToAddTogether) => {
                            //     let reducedArray = [];
                            //     arrayToReduce.reduce((acc, curr, ind, src) => {
                            //         if (Object.is(acc[keyToReference], curr[keyToReference]) && !Object.is(acc[kvpThatMayDiffer], curr[kvpThatMayDiffer])) {
                            //             acc[keyToAddTogether] = parseInt(acc[keyToAddTogether]) + parseInt(curr[keyToAddTogether]);
                            //             reducedArray.push(acc);
                            //             return src[src.indexOf(acc)];
                            //         }
                            //         // console.log(src.indexOf(curr)) //index curr
                            //         return src[src.indexOf(curr)];
                            //     })
                            //     console.log(reducedArray)
                            // }


                            let omhof = {
                                weekly: getRelevantData('kiosks-7day', "page_path", "/detail", "page_title"),
                                daily: getRelevantData('kiosks-today', "page_path", "/detail", "page_title")
                            }
                            omhof.weekly = splitLeftRight(omhof.weekly, 'page_title', 'hostname', 'count')
                            omhof.daily = splitLeftRight(omhof.daily, 'page_title', 'hostname', 'count')

                            // omhof.weekly = tester(omhof.weekly, 'page_title', 'count')

                            // splitLeftRight(omhof.weekly, 'page_title', 'hostname', 'count');
                            // splitLeftRight(omhof.daily, 'page_title', 'hostname', 'count');
                            // combineLeftRight(omhof.weekly, 'page_title', 'hostname', 'count');
                            // combineLeftRight(omhof.daily, 'page_title', 'hostname', 'count')
                            // console.log(omhof)
                            let weeklyData = { omoData };
                            Object.assign(weeklyData, { omhof })
                            Object.assign(weeklyData, timberData(cleanData))
                            console.log(weeklyData)
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
