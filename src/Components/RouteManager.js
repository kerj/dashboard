import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { OmoGraphData } from '../ApiHandlers/OmoGames'
import { BarChart } from './BarChart';
import { DonutGraph } from './DonutGraph';
import { TopList } from './TopList';
import { allRoutes } from './DataRoutes';
import { useInterval } from '../Hooks/useInterval'

export default function RouteManager(props) {
    let routesAvailable = allRoutes.routes;
    const [routes, setRoutes] = useState({
        dataIndex: 0,
        route: routesAvailable[0],
    });
    const [chartData, setChartData] = useState([])
    //used for multiple sets of data being shown on charts/graphs
    const [data0, setData0] = useState([])
    const [data1, setData1] = useState([])
    const weeklyData = props.stateHelper;

    const GRAPH = {
        //omoGames
        'OHS - CHUTES GAME': <BarChart dataToGraph={chartData} title={'OHS - CHUTES'} labelOne={' GAME STARTED VS '} labelTwo={' FINISHED'} colorOne={'rgb(255,45,29)'} colorTwo={'rgb(162,54,40)'} />,
        'OHS - FLECTCHER GAME': <BarChart dataToGraph={chartData} title={'OHS - FLECTCHER'} labelOne={' GAME STARTED VS '} labelTwo={' FINISHED'} colorOne={'rgb(255,111,3)'} colorTwo={'rgb(255,172,26)'} />,
        'OHS - VORTEX GAME': <BarChart dataToGraph={chartData} title={'OHS - VORTEX'} labelOne={' GAME STARTED VS '} labelTwo={' FINISHED'} colorOne={'rgb(255,172,6)'} colorTwo={'rgb(128, 207, 154)'} />,
        'OHS - MARIE GAME': <BarChart dataToGraph={chartData} title={'OHS - MARIE'} labelOne={' GAME STARTED VS '} labelTwo={' FINISHED'} colorOne={'rgb(186,206,44)'} colorTwo={'rgb(107,155,45)'} />,
        'OHS - CHUTES STORY': <BarChart dataToGraph={chartData} title={'OHS - CHUTES'} labelOne={' STORY STARTED VS '} labelTwo={' FINISHED'} colorOne={'rgb(255,45,29)'} colorTwo={'rgb(162,54,40)'} />,
        'OHS - FLECTCHER STORY': <BarChart dataToGraph={chartData} title={'OHS - FLECTCHER'} labelOne={' STORY STARTED VS '} labelTwo={' FINISHED'} colorOne={'rgb(255,111,3)'} colorTwo={'rgb(255,172,26)'} />,
        'OHS - VORTEX STORY': <BarChart dataToGraph={chartData} title={'OHS - VORTEX'} labelOne={' STORY STARTED VS '} labelTwo={' FINISHED'} colorOne={'rgb(255,172,6)'} colorTwo={'rgb(128, 207, 154)'} />,
        'OHS - MARIE STORY': <BarChart dataToGraph={chartData} title={'OHS - MARIE'} labelOne={' STORY STARTED VS '} labelTwo={' FINISHED'} colorOne={'rgb(186,206,44)'} colorTwo={'rgb(107,155,45)'} />,
        'OHS - WEEKLY GAMES VS STORIES': data0.length > 0 && data1.length > 0 ? <DonutGraph data0={data0} data1={data1} title={'OHS'} subtitle={'GAMES VS STORIES'} /> : null,
        'OHS - WEEKLY GAMES FINISHED': chartData.length > 0 ? <TopList dataToGraph={chartData} title={'OHS'} subtitle={'COMPLETED - THIS WEEK'} /> : null,
        'OHS - MOST READ THIS WEEK': chartData.length > 0 ? <TopList dataToGraph={chartData} title={'OHS'} subtitle={'MOST READ STORY - THIS WEEK'} /> : null,
        //omhof
        'OMHOF TOP AWARDS': chartData.length > 0 ?  <TopList dataToGraph={chartData} title={'OMHOF'} subtitle={'Popular Awards - This Week'} /> : null,
        'OMHOF AWARD OF THE DAY': chartData.length > 0 ?  <TopList dataToGraph={chartData} title={'OMHOF'} subtitle={'Most Popular Award - Today'} /> : null,
        //timbers
        'TIMBERS WEEKLY TOP EMOJIS': <TopList dataToGraph={chartData} title={routes.route} />,
        'NEW VS. RETURNING VISITORS': <BarChart dataToGraph={chartData} title={routes.route} />,
        'MOST POPULAR EMOJI TODAY': <TopList dataToGraph={chartData} title={routes.route} />,
        'MOBILE OPERATING SYSTEMS': <DonutGraph dataToGraph={chartData} title={routes.route} />,
    }

    //routes change every 15 seconds
    useInterval(() => {
        updateRoute();
    }, 15000)

    useEffect(() => {
        // Sanity check; route and data route should be matches.
        if (routes.route !== allRoutes.routes[routes.dataIndex]) {
            console.warn('Display route and data routes are mismatched!', routes.route, allRoutes.routes[routes.dataIndex])
        }
        setChartData([])
        makeNewChartData()
        // Deliberately excluding makeNewChartData because it will cause an infinite loop,
        // and we're probably making it go away eventually, anyway.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [routes])
    //cycles through each route then change to next dataset and repeats
    function updateRoute() {
        const nextIndex = (routes.dataIndex + 1) % routesAvailable.length
        setRoutes(allRoutes.routes[nextIndex])
        setRoutes({
            dataIndex: nextIndex,
            route: routesAvailable[nextIndex],
        })
    }


    function makeNewChartData() {
        const newChartData = []

        //assigns graphable objects to propsToPass array
        let gameProps = weeklyData.omoData;
        let timberProps = weeklyData.timberData;
        let omhofProps = weeklyData.omhof;

        switch (routes.route) {
            case 'OHS - CHUTES GAME':
                setChartData(OmoGraphData.omoBarChart(gameProps.chutes.finishedGames.reverse()))
                break;
            case 'OHS - FLECTCHER GAME':
                setChartData(OmoGraphData.omoBarChart(gameProps.fletcher.finishedGames.reverse()))
                break;
            case 'OHS - VORTEX GAME':
                setChartData(OmoGraphData.omoBarChart(gameProps.vortex.finishedGames.reverse())) 
                break;
            case 'OHS - MARIE GAME':
                setChartData(OmoGraphData.omoBarChart(gameProps.marie.finishedGames.reverse()))
                break;
            case 'OHS - CHUTES STORY':
                setChartData(OmoGraphData.omoBarChart(gameProps.chutes.stories.reverse()))
                break;
            case 'OHS - FLECTCHER STORY':
                setChartData(OmoGraphData.omoBarChart(gameProps.fletcher.stories.reverse()))
                break;
            case 'OHS - VORTEX STORY':
                setChartData(OmoGraphData.omoBarChart(gameProps.vortex.stories.reverse()))
                break;
            case 'OHS - MARIE STORY':
                setChartData(OmoGraphData.omoBarChart(gameProps.marie.stories.reverse()))
                break;
            case 'OHS - MOST READ THIS WEEK':
                const storiesRead = OmoGraphData.weeklyCompleted(gameProps, 'stories')
                const mostReadWeekly = storiesRead.reduce((acc, curr) => {
                    return acc.dataSet1 >= curr.dataSet1 ? acc : curr
                })
                setChartData([mostReadWeekly])
                break;
            case 'OHS - WEEKLY GAMES FINISHED':
                const gamesFinished = OmoGraphData.weeklyCompleted(gameProps, 'finishedGames')
                gamesFinished.sort((a, b) => (b.dataSet1 < a.dataSet1) ? -1 : ((a.dataSet1 > b.dataSet1) ? 1 : 0));
                setChartData(gamesFinished)
                break;
            case 'OHS - WEEKLY GAMES VS STORIES':
                let highProp;
                const newData0 = []
                const newData1 = []
                Object.keys(gameProps).map((c) => {
                    highProp = gameProps[c].finishedGames.reduce((acc, curr) => {
                        let gameName = c
                        curr.highProp = acc.dataSet1 ? (parseInt(acc.dataSet1) + parseInt(curr.finished)) : curr.finished
                        const { highProp: dataSet1 = 0, name: dataSet0 = 'Game', name: labels = gameName } = { ...curr }
                        let tempProp = Object.assign({}, { dataSet0, dataSet1, labels });
                        return tempProp
                    })
                    return newData0.unshift(highProp)
                })
                Object.keys(gameProps).map((c, i) => {
                    highProp = gameProps[c].stories.reduce((acc, curr) => {
                        let gameName = c
                        curr.highProp = acc.dataSet1 ? (parseInt(acc.dataSet1) + parseInt(curr.finished)) : curr.finished
                        const { highProp: dataSet1 = 0, name: dataSet0 = 'Story', name: labels = gameName } = { ...curr }
                        let tempProp = Object.assign({}, { dataSet0, dataSet1, labels });
                        return tempProp
                    })
                    return newData1.unshift(highProp)
                })
                const setDonut = () => {
                    setData0(newData0)
                    setData1(newData1)
                }
                setDonut()
                break;
            case 'OMHOF TOP AWARDS':
                omhofProps.weekly.map((c) => {
                    const { logoName: dataSet0, weeklyTotal: dataSet1 = 0, title: labels } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    return newChartData.push(propToPass);
                })
                setChartData(newChartData)
                break;
            case 'OMHOF AWARD OF THE DAY':
                omhofProps.daily.map((c) => {
                    const { logoName: dataSet0, weeklyTotal: dataSet1 = 0, title: labels } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    return newChartData.unshift(propToPass);
                })
                newChartData.splice(1)
                setChartData(newChartData)
                break;
            case 'TIMBERS WEEKLY TOP EMOJIS':
                timberProps.top5Emoji.map((c) => {
                    const { 'ga:eventLabel1': dataSet0, 'ga:eventLabel1': dataSet1, 'ga:totalEvents1': labels = ':D' } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    return newChartData.unshift(propToPass);
                })
                setChartData(newChartData)
                break;
            case 'NEW VS. RETURNING VISITORS':
                timberProps.user.map((c) => {
                    const { 'new': dataSet0, 'return': dataSet1, 'ga:dayOfWeekName0': labels } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    return newChartData.unshift(propToPass);
                })
                newChartData.reduce((curr, acc) => {
                    curr['dataSet0'] !== "null" ?
                        curr['dataSet1'] = acc['dataSet1'] :
                        curr['dataSet0'] = acc['dataSet0'];
                    return acc
                })
                for (let i = 0; i < newChartData.length; i++) {
                    newChartData.splice(i + 1, 1)
                }
                setChartData(newChartData)
                break;
            case 'MOST POPULAR EMOJI TODAY':
                timberProps.mostPopEmoji.map((c) => {
                    const { 'ga:eventLabel2': dataSet0 = 'none used', 'ga:totalEvents2': dataSet1 = "today", 'ga:eventLabel2': labels = ':D' } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    return newChartData.unshift(propToPass);
                })
                setChartData(newChartData)
                break;
            case 'MOBILE OPERATING SYSTEMS':
                timberProps.operatingSystem.map((c) => {
                    const { 'ga:sessions3': dataSet0, 'ga:operatingSystem3': dataSet1, 'ga:operatingSystemVersion3': labels } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    return newChartData.unshift(propToPass);
                })
                setChartData(newChartData)
                break;
            default:
                break;
        }
    }

    return (
        <>
            {GRAPH[routes.route]}
        </>
    )
}

RouteManager.propTypes = {
    stateHelper: PropTypes.object.isRequired
}
