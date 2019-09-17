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
    const weeklyData = props.stateHelper.data;
    console.log(weeklyData)
    //routes change every 15 seconds
    useInterval(() => {
        updateRoute();
        setPropsToPass();
    }, 15000)
    //hook to update view when routes change
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
            (dataRoute.datasetIterator + 1 > dataToCycle.length - 1 ? setDataRoute({ routeIterator: 0, datasetIterator: 0 }) : setDataRoute({ routeIterator: 0, datasetIterator: dataRoute.datasetIterator + 1 })) :
            setDataRoute({ routeIterator: dataRoute.routeIterator + 1, datasetIterator: dataRoute.datasetIterator })
    }
    function setPropsToPass() {
        propsToPass.length = 0;
        const ROUTES = {
            //omoGames
            stackedGameChutes: <BarChart dataToGraph={propsToPass} title={route} />,
            stackedGameFletcher: <BarChart dataToGraph={propsToPass} title={route} />,
            stackedGameVortex: <BarChart dataToGraph={propsToPass} title={route} />,
            stackedGameMarie: <BarChart dataToGraph={propsToPass} title={route} />,
            stackedStoryChutes: <BarChart dataToGraph={propsToPass} title={route} />,
            stackedStoryFletcher: <BarChart dataToGraph={propsToPass} title={route} />,
            stackedStoryVortex: <BarChart dataToGraph={propsToPass} title={route} />,
            stackedStoryMarie: <BarChart dataToGraph={propsToPass} title={route} />,
            listMostCompleted: <EmojiList dataToGraph={propsToPass} title={route} />,
            listWeeklyTotal: <EmojiList dataToGraph={propsToPass} title={route} />,
            //omhof
            listWeekAwards: <EmojiList dataToGraph={propsToPass} title={route} />,
            awardOfTheDay: <EmojiList dataToGraph={propsToPass} title={route} />,
            //timbers
            listWeekTopEmojis: <EmojiList dataToGraph={propsToPass} title={route} />,
            stackedBarNewVReturn: <BarChart dataToGraph={propsToPass} title={route} />,
            mostPopularEmoji: <EmojiList dataToGraph={propsToPass} title={route} />,
            mobileIosVsAndroid: <DonutGraph dataToGraph={propsToPass} title={route} />,
        }
        //assigns graphable objects to propsToPass array
        switch (currentKey) {
            case 'omo':
                let gameProps = weeklyData.omoData;
                switch (route) {
                    case 'stackedGameChutes':
                        gameProps.chutes.finishedGames.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'stackedGameFletcher':
                        gameProps.fletcher.finishedGames.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'stackedGameVortex':
                        gameProps.marie.finishedGames.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'stackedGameMarie':
                        gameProps.vortex.finishedGames.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'stackedStoryChutes':
                        gameProps.chutes.stories.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'stackedStoryFletcher':// glitch showing two set of data
                        gameProps.fletcher.stories.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'stackedStoryVortex':
                        gameProps.vortex.stories.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'stackedStoryMarie':
                        gameProps.marie.stories.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'listMostCompleted': // these last two need a special category made for them
                        gameProps.chutes.stories.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case "listWeeklyTotal":
                        gameProps.chutes.stories.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    default:
                }
                break;
            case 'omhofWeekly':
                let omhofWeeklyProps = weeklyData.weekly;
                omhofWeeklyProps.map((c) => {
                    const { page_path: dataSet0, count: dataSet1 = 0, page_title: labels } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    return propsToPass.push(propToPass);
                })
                break;
            case 'omhofDaily':
                let omhofDailyProps = weeklyData.daily;
                omhofDailyProps.map((c) => {
                    const { page_path: dataSet0, count: dataSet1 = 0, page_title: labels } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    return propsToPass.push(propToPass);
                })
                break;
            case 'timbers':
                let timberProps = weeklyData.timberData;
                switch (route) {
                    case 'listWeekTopEmojis':
                        timberProps.top5Emoji.map((c) => {
                            const { 'ga:eventLabel1': dataSet0, 'ga:totalEvents1': dataSet1, 'ga:totalEvents1': labels = ':D' } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'stackedBarNewVReturn':
                        timberProps.user.map((c) => {
                            const { 'new': dataSet0, 'return': dataSet1, 'ga:dayOfWeekName0': labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        propsToPass.reduce((curr, acc) => {
                            curr['dataSet0'] !== "null" ?
                                curr['dataSet1'] = acc['dataSet1'] :
                                curr['dataSet0'] = acc['dataSet0'];
                            return acc
                        })
                        for (let i = 0; i < propsToPass.length; i++) {
                            propsToPass.splice(i + 1, 1)
                        }
                        break;
                    case 'mostPopularEmoji':
                        timberProps.mostPopEmoji.map((c) => {
                            const { 'ga:eventLabel2': dataSet0 = 'none used', 'ga:totalEvents2': dataSet1 = "today", 'ga:totalEvents2': labels = ':D' } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'mobileIosVsAndroid':
                        timberProps.operatingSystem.map((c) => {
                            const { 'ga:sessions3': dataSet0, 'ga:operatingSystem3': dataSet1, 'ga:operatingSystemVersion3': labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    default:
                }
                //Add more data sets here
                break
            default:
        }
        //returns the view for the graph
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