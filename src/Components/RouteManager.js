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
        //assigns graphable objects to propsToPass array
        switch (currentKey) {
            case 'omoGames':
                let gameProps = weeklyData[dataRoute.routeIterator].finishedGames;
                gameProps.map((c) => {
                    const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    propsToPass.push(propToPass);
                })
                break;
            case 'omoStories':
                let storyProps = weeklyData[dataRoute.routeIterator].stories;
                storyProps.map((c) => {
                    const { finished: dataSet0, started: dataSet1 = 0, day: labels } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    propsToPass.push(propToPass);
                })
                break;
            case 'omhofWeekly':
                let omhofWeeklyProps = weeklyData[dataRoute.routeIterator].weekly;
                omhofWeeklyProps.map((c) => {
                    const { page_path: dataSet0, count: dataSet1 = 0, page_title: labels } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    propsToPass.push(propToPass);
                })
                break;
            case 'omhofDaily':
                let omhofDailyProps = weeklyData[dataRoute.routeIterator].daily;
                omhofDailyProps.map((c) => {
                    const { page_path: dataSet0, count: dataSet1 = 0, page_title: labels } = { ...c }
                    const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                    propsToPass.push(propToPass);
                })
                break;
            case 'timbers':
                let timberProps = weeklyData[dataRoute.routeIterator].timberData;
                switch (route) {
                    case 'listWeekTopEmojis':
                        timberProps.top5Emoji.map((c) => {
                            const { 'ga:eventLabel1': dataSet0, 'ga:totalEvents1': dataSet1, 'ga:totalEvents1': labels = ':D' } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            propsToPass.push(propToPass);
                        })
                        break;
                    case 'stackedBarNewVReturn':
                        timberProps.user.map((c) => {
                            const { 'new': dataSet0, 'return': dataSet1, 'ga:dayOfWeekName0': labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            propsToPass.push(propToPass);
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
                            const { 'ga:eventLabel2': dataSet0, 'ga:totalEvents2': dataSet1, 'ga:totalEvents2': labels = ':D' } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            propsToPass.push(propToPass);
                        })
                        break;
                    case 'mobileIosVsAndroid':
                        timberProps.operatingSystem.map((c) => {
                            const { 'ga:sessions3': dataSet0, 'ga:operatingSystem3': dataSet1, 'ga:operatingSystemVersion3': labels } = { ...c }
                            const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
                            propsToPass.push(propToPass);
                        })
                        break;
                }
                //Add more data sets here
                break
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