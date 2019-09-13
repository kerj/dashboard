import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';

export default function RouteManager(props) {
    let dataToCycle = Object.keys(props.stateHelper).slice(2);
    let [dataRoute, setDataRoute] = useState({ routeIterator: 0, datasetIterator: 0 })
    let routesAvailable = props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes;
    let [route, setRoute] = useState({ route: routesAvailable[dataRoute.routeIterator] });
    let currentKey = dataToCycle[dataRoute.datasetIterator];

    let propsToPass = [];

    const dataSet = props.stateHelper.data;
    const weeklyData = Object.values(dataSet);

    //routes change every 15 seconds
    useInterval(() => {
        updateRoute();
        setPropsToPass();
    }, 15000)

    function useInterval(callback, delay) {
        const savedCallback = useRef();
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay])
    }
    //cycles through each route then change to next dataset and repeats
    function updateRoute() {
        setRoute(props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes[dataRoute.routeIterator]);

        dataRoute.routeIterator + 1 > routesAvailable.length - 1 || !routesAvailable.length === 2 ?
            dataRoute.datasetIterator + 1 > dataToCycle.length - 1 ?
                setDataRoute({ routeIterator: 0, datasetIterator: 0 }) :
                setDataRoute({ routeIterator: 0, datasetIterator: dataRoute.datasetIterator + 1 }) :
            setDataRoute({ routeIterator: dataRoute.routeIterator + 1, datasetIterator: dataRoute.datasetIterator })
    }

    function setPropsToPass() {
        // console.log(currentKey, route); this is the log to troubleshoot if needed
        propsToPass.length = 0;
        //route = key : currentKey = value ....ie, 'stackedBar' : 'weeklyWeather'
        const ROUTES = {
            //omoGames
            stackedBarChutes: <BarChart dataToGraph={propsToPass} title={route} />,
            stackedBarFletcher: <BarChart dataToGraph={propsToPass} title={route} />,
            stackedBarVortex: <BarChart dataToGraph={propsToPass} title={route} />,
            stackedBarMarie: <BarChart dataToGraph={propsToPass} title={route} />,
            //omoStories
            listMostCompleted: <EmojiList dataToGraph={propsToPass} title={route} />,
            listMostStarted: <EmojiList dataToGraph={propsToPass} title={route} />,
            //omhof
            listWeekAwards: <EmojiList dataToGraph={propsToPass} title={route} />,
            awardOfTheDay: <EmojiList dataToGraph={propsToPass} title={route} />,
            //timbers
            listWeekTopEmojis: <EmojiList dataToGraph={propsToPass} title={route} />,
            stackedBarNewVReturn: <BarChart dataToGraph={propsToPass} title={route} />,
            mostPopularEmoji: <EmojiList dataToGraph={propsToPass} title={route} />,
            mobileIosVsAndroid: <DonutGraph dataToGraph={propsToPass} title={route} />,
        }


        if (currentKey === 'omoGames') {
            let gameProps = weeklyData[dataRoute.routeIterator].finishedGames;
            gameProps.map((d) => {
                let propToPass = {};
                let { finished: dataSet1, started: dataSet0 = 0, day: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.push(propToPass);
            })
        } else if (currentKey === 'omoStories') {
            //need to find the story with the highest counts most read for the day then  
            let storyProps = weeklyData[dataRoute.routeIterator].stories;
            storyProps.map((d) => {
                let propToPass = {};
                let { finished: dataSet0, started: dataSet1 = 0, day: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.push(propToPass);
            })
        } else if (currentKey === 'omhofWeekly') {
            let omhofWeeklyProps = weeklyData[dataRoute.routeIterator].weekly;
            omhofWeeklyProps.map((d) => {
                let propToPass = {};
                let { page_path: dataSet0, count: dataSet1 = 0, page_title: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.push(propToPass);
            })
        } else if (currentKey === 'omhofDaily') {
            let omhofDailyProps = weeklyData[dataRoute.routeIterator].daily;
            omhofDailyProps.map((d) => {
                let propToPass = {};
                let { page_path: dataSet0, count: dataSet1 = 0, page_title: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.push(propToPass);
            })
        } else if (currentKey === 'timbers') {
            let timberProps = weeklyData[dataRoute.routeIterator].timberData;
            if (dataRoute.routeIterator === 0) {
                timberProps.top5Emoji.map((d) => {
                    let propToPass = {};
                    let { 'ga:eventLabel1': dataSet0, 'ga:totalEvents1': dataSet1, 'ga:totalEvents1': labels = ':D' } = d
                    propToPass.dataSet0 = `${dataSet0}`
                    propToPass.dataSet1 = `${dataSet1}`
                    propToPass.labels = `${labels}`
                    propsToPass.push(propToPass);
                })
            } else if (dataRoute.routeIterator === 1) {
                console.log(timberProps.user.length)
                timberProps.user.map((d) => {
                    let propToPass = {};
                    let { 'new': dataSet0, 'return': dataSet1, 'ga:dayOfWeekName0': labels } = d
                    propToPass.dataSet0 = `${dataSet0}`
                    propToPass.dataSet1 = `${dataSet1}`
                    propToPass.labels = `${labels}`
                    propsToPass.push(propToPass);
                })
                propsToPass.reduce((acc, curr) => {
                    if (curr['dataSet0'] !== "null"){
                        acc['dataSet0'] = curr['dataSet0']
                    }else if(curr['dataSet0'] === "null" ){
                        curr['dataSet0'] = acc['dataSet0']
                    }else if (curr['dataSet1'] !== "null"){
                        acc['dataSet1'] = curr['dataSet1']
                    }else{
                        curr['dataSet1'] = acc['dataSet1']
                    }
                    return acc
                })
                for( let i = 0; i < propsToPass.length; i++){
                    propsToPass.splice(i, 1)
                }
            } else if (dataRoute.routeIterator === 2) {
                console.log(timberProps.mostPopEmoji.length)
                timberProps.mostPopEmoji.map((d) => {
                    let propToPass = {};
                    let { 'ga:eventLabel2': dataSet0, 'ga:totalEvents2': dataSet1, 'ga:totalEvents2': labels = ':D' } = d
                    propToPass.dataSet0 = `${dataSet0}`
                    propToPass.dataSet1 = `${dataSet1}`
                    propToPass.labels = `${labels}`
                    propsToPass.push(propToPass);
                })
            } else if (dataRoute.routeIterator === 3) {
                console.log(timberProps.operatingSystem.length)
                timberProps.operatingSystem.map((d) => {
                    let propToPass = {};
                    let { 'ga:sessions3': dataSet0, 'ga:operatingSystem3': dataSet1, 'ga:operatingSystemVersion3': labels } = d
                    propToPass.dataSet0 = `${dataSet0}`
                    propToPass.dataSet1 = `${dataSet1}`
                    propToPass.labels = `${labels}`
                    propsToPass.push(propToPass);
                })
                // propsToPass.reduce((acc, curr) => {
                //     if (curr['dataSet0'] !== "null"){
                //         acc['dataSet0'] = curr['dataSet0']
                //     }else if(curr['dataSet0'] === "null" ){
                //         curr['dataSet0'] = acc['dataSet0']
                //     }else if (curr['dataSet1'] !== "null"){
                //         acc['dataSet1'] = curr['dataSet1']
                //     }else{
                //         curr['dataSet1'] = acc['dataSet1']
                //     }
                //     return acc
                // })
                // for( let i = 0; i < propsToPass.length; i++){
                //     propsToPass.splice(i, 1)
                // }
            }
        }


        return (
            <div key={route}>
                {ROUTES[route]}
            </div>
        )
    }

    return (
        <div>
            {setPropsToPass()}
        </div>
    )
}

RouteManager.propTypes = {
    stateHelper: PropTypes.object.isRequired
}