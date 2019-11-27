import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import { DonutGraph } from './DonutGraph';
import EmojiList from './EmojiList';
import { allRoutes } from './DataRoutes';
import {useInterval} from '../Hooks/useInterval'

export default function RouteManager(props) {
    let routesAvailable = allRoutes.routes;
    let [routes, setRoutes] = useState({
        dataIndex: 0,
        route: routesAvailable[0],
    });

    let propsToPass = [];
    //used for multiple sets of data being shown on charts/graphs
    let data0 = [];
    let data1 = [];

    const weeklyData = props.stateHelper;

    const ROUTES = {
        //omoGames
        'OHS - CHUTES GAME': <BarChart dataToGraph={propsToPass} title={'OHS - CHUTES'} labelOne={' GAME STARTED VS ' } labelTwo={ ' FINISHED'} colorOne={'rgb(255,45,29)'} colorTwo={'rgb(162,54,40)'} />,
        'OHS - FLECTCHER GAME': <BarChart dataToGraph={propsToPass} title={ 'OHS - FLECTCHER'} labelOne={' GAME STARTED VS ' } labelTwo={ ' FINISHED'} colorOne={'rgb(255,111,3)'} colorTwo={'rgb(255,172,26)'} />,
        'OHS - VORTEX GAME': <BarChart dataToGraph={propsToPass} title={'OHS - VORTEX'} labelOne={' GAME STARTED VS ' } labelTwo={ ' FINISHED'} colorOne={'rgb(255,172,6)'} colorTwo={'rgb(128, 207, 154)'} />,
        'OHS - MARIE GAME': <BarChart dataToGraph={propsToPass} title={'OHS - MARIE'} labelOne={' GAME STARTED VS ' } labelTwo={ ' FINISHED'} colorOne={'rgb(186,206,44)'} colorTwo={'rgb(107,155,45)'} />,
        'OHS - CHUTES STORY': <BarChart dataToGraph={propsToPass} title={'OHS - CHUTES'} labelOne={' STORY STARTED VS ' } labelTwo={ ' FINISHED'} colorOne={'rgb(255,45,29)'} colorTwo={'rgb(162,54,40)'} />,
        'OHS - FLECTCHER STORY': <BarChart dataToGraph={propsToPass} title={'OHS - FLECTCHER'} labelOne={' STORY STARTED VS ' } labelTwo={ ' FINISHED'}  colorOne={'rgb(255,111,3)'} colorTwo={'rgb(255,172,26)'}  />,
        'OHS - VORTEX STORY': <BarChart dataToGraph={propsToPass} title={'OHS - VORTEX'} labelOne={' STORY STARTED VS ' } labelTwo={ ' FINISHED'} colorOne={'rgb(255,172,6)'} colorTwo={'rgb(128, 207, 154)'} />,
        'OHS - MARIE STORY': <BarChart dataToGraph={propsToPass} title={'OHS - MARIE'} labelOne={' STORY STARTED VS ' } labelTwo={ ' FINISHED'} colorOne={'rgb(186,206,44)'} colorTwo={'rgb(107,155,45)'} />,
        'OHS - WEEKLY GAMES VS STORIES': <DonutGraph data0={data0} data1={data1} title={'OHS'} subtitle={'GAMES VS STORIES'} />,
        'OHS - WEEKLY STORIES READ': <EmojiList dataToGraph={propsToPass} title={'OHS'} subtitle={'COMPLETED - THIS WEEK'} />, 
        'OHS - MOST READ THIS WEEK': <EmojiList dataToGraph={propsToPass} title={'OHS'} subtitle={'MOST READ STORY - THIS WEEK'} />,
        //omhof
        'OMHOF TOP AWARDS': <EmojiList dataToGraph={propsToPass} title={'OMHOF'} subtitle={'Popular Awards - This Week'} />,
        'OMHOF AWARD OF THE DAY': <EmojiList dataToGraph={propsToPass} title={'OMHOF'} subtitle={'Most Popular Award - Today'} />,
        //timbers
        'TIMBERS WEEKLY TOP EMOJIS': <EmojiList dataToGraph={propsToPass} title={routes.route} />,
        'NEW VS. RETURNING VISITORS': <BarChart dataToGraph={propsToPass} title={routes.route} />,
        'MOST POPULAR EMOJI TODAY': <EmojiList dataToGraph={propsToPass} title={routes.route} />,
        'MOBILE OPERATING SYSTEMS': <DonutGraph dataToGraph={propsToPass} title={routes.route} />,
    }

    //routes change every 15 seconds
    useInterval(() => {
        updateRoute();
    }, 15000)

    useEffect(() => {
        // Sanity check; route and data route should be matches.
        if (routes.route !== allRoutes.routes[routes.dataIndex]) {
            console.warn('Display route and data routes are mismatched!',routes.route, allRoutes.routes[routes.dataIndex])
        }
        setPropsToPass()
    }, [routes, setPropsToPass])
    //cycles through each route then change to next dataset and repeats
    function updateRoute() {
        const nextIndex = (routes.dataIndex + 1) % routesAvailable.length
        setRoutes(allRoutes.routes[nextIndex])
        setRoutes({
            dataIndex: nextIndex,
            route: routesAvailable[nextIndex],
        })
    }

    function setPropsToPass() {
        propsToPass.length = 0;

        //assigns graphable objects to propsToPass array
                let gameProps = weeklyData.omoData;
        let timberProps = weeklyData.timberData;
        let omhofProps = weeklyData.omhof;
        switch (routes.route) {
                    case 'OHS - CHUTES GAME':
                        gameProps.chutes.finishedGames.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.unshift(propToPass);
                        })
                        break;
                    case 'OHS - FLECTCHER GAME':
                        gameProps.fletcher.finishedGames.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.unshift(propToPass);
                        })
                        break;
                    case 'OHS - VORTEX GAME':
                        gameProps.marie.finishedGames.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.unshift(propToPass);
                        })
                        break;
                    case 'OHS - MARIE GAME':
                        gameProps.vortex.finishedGames.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.unshift(propToPass);
                        })
                        break;
                    case 'OHS - CHUTES STORY':
                        gameProps.chutes.stories.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.unshift(propToPass);
                        })
                        break;
                    case 'OHS - FLECTCHER STORY':
                        gameProps.fletcher.stories.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.unshift(propToPass);
                        })
                        break;
                    case 'OHS - VORTEX STORY':
                        gameProps.vortex.stories.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.unshift(propToPass);
                        })
                        break;
                    case 'OHS - MARIE STORY':
                        gameProps.marie.stories.map((c) => {
                            const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.unshift(propToPass);
                        })
                        break;
                    case 'OHS - MOST READ THIS WEEK':
                        Object.keys(gameProps).map((c) => {
                            gameProps[c].stories.reduce((prev, curr) => {
                                let gameName = c
                                const { weekFinished: dataSet1 = 0, name: dataSet0 = gameName, name: labels = gameName } = { ...curr }
                                let tempProp = Object.assign({}, { dataSet0, dataSet1, labels });
                                if (tempProp.dataSet1 < curr.weekFinished) {
                                    tempProp.dataSet1 = curr.weekFinished
                                }
                                return propsToPass.push(tempProp)
                            })
                            let highestProp;
                            propsToPass.reduce((prev, curr) => {
                                highestProp = (prev.dataSet1 > curr.dataSet1) ? prev : curr;
                                return (prev.dataSet1 > curr.dataSet1) ? prev : curr;
                            })
                            propsToPass.splice(0);
                            return propsToPass.push(highestProp)
                        })
                        break;
                    case 'OHS - WEEKLY STORIES READ':
                        Object.keys(gameProps).map((c, i) => {
                            let weeklyTotal = gameProps[c].finishedGames.reduce((acc, curr) => {
                                let gameName = c
                                const { weekFinished: dataSet1 = 0, name: dataSet0 = gameName, name: labels = gameName } = { ...curr }
                                let tempProp = Object.assign({}, { dataSet0, dataSet1, labels });
                                if (tempProp.dataSet1 < curr.weekFinished) {
                                    tempProp.dataSet1 = curr.weekFinished
                                }
                                return tempProp
                            })
                            propsToPass.push(weeklyTotal)
                            return propsToPass.sort((a, b) => (b.dataSet1 < a.dataSet1) ? -1 : ((a.dataSet1 > b.dataSet1) ? 1 : 0));;
                        })
                        break;
                    case 'OHS - WEEKLY GAMES VS STORIES':
                        let highProp;
                        data0.length = 0
                        data1.length = 0
                        Object.keys(gameProps).map((c) => {
                            highProp = gameProps[c].finishedGames.reduce((prev, curr) => {
                                highProp = (prev.dataSet1 > curr.dataSet1) ? prev : curr;
                                highProp.name = c;
                                return (prev.dataSet1 > curr.dataSet1) ? prev : curr;
                            })
                            const {dataSet0 = 'Game', weekFinished : dataSet1, name: labels } = { ...highProp }
                            let tempProp = Object.assign({}, {dataSet0, dataSet1,  labels });
                            return data0.push(tempProp)
                        })
                        Object.keys(gameProps).map((c, i) => {
                            highProp = gameProps[c].stories.reduce((prev, curr) => {
                                highProp = (prev.dataSet1 > curr.dataSet1) ? prev : curr;
                                highProp.name = c;
                                return (prev.dataSet1 > curr.dataSet1) ? prev : curr;
                            })
                            const {dataSet0 = 'Story', weekFinished: dataSet1, name: labels } = { ...highProp }
                            let tempProp = Object.assign({}, {dataSet0, dataSet1, labels })
                            return data1.push(tempProp)
                        })
                        break;
                    case 'OMHOF TOP AWARDS':
                        omhofProps.weekly.map((c) => {
                            const { page_path: dataSet0, count: dataSet1 = 0, 'page_title-cleaned': labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'OMHOF AWARD OF THE DAY':
                        omhofProps.daily.map((c) => {
                            const { page_path: dataSet0, count: dataSet1 = 0, 'page_title-cleaned': labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        propsToPass.splice(1)
                        break;
                    case 'TIMBERS WEEKLY TOP EMOJIS':
                        timberProps.top5Emoji.map((c) => {
                            const { 'ga:eventLabel1': dataSet0, 'ga:eventLabel1': dataSet1, 'ga:totalEvents1': labels = ':D' } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'NEW VS. RETURNING VISITORS':
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
                    case 'MOST POPULAR EMOJI TODAY':
                        timberProps.mostPopEmoji.map((c) => {
                            const { 'ga:eventLabel2': dataSet0 = 'none used', 'ga:totalEvents2': dataSet1 = "today", 'ga:eventLabel2': labels = ':D' } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    case 'MOBILE OPERATING SYSTEMS':
                        timberProps.operatingSystem.map((c) => {
                            const { 'ga:sessions3': dataSet0, 'ga:operatingSystem3': dataSet1, 'ga:operatingSystemVersion3': labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            return propsToPass.push(propToPass);
                        })
                        break;
                    default:
                        break;
                }
        //returns the view for the graph
        return (
            <div key={routes.route}>
                {ROUTES[routes.route]}
            </div>
        )
    }

    return (
        <>
            {setPropsToPass()}
        </>
    )
}

RouteManager.propTypes = {
    stateHelper: PropTypes.object.isRequired
}
