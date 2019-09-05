import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';

export default function RouteManager(props) {
    let dataToCycle = Object.keys(props.stateHelper).slice(2);
    let [dataRoute, setDataRoute] = useState({ routeIterator: 0, datasetIterator: 0 })
    let routesAvailable = props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes;
    let [route, setRoute] = useState({route: 0});
    let currentKey = dataToCycle[dataRoute.datasetIterator];

    
    
  

    let propsToPass = [];

    const dataSet = props.stateHelper.data;
    //routes change every 15 seconds
    useInterval(() => {
        updateRoute();
        setPropsToPass();
    }, 5000)

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
                setDataRoute({ routeIterator: 0, datasetIterator: dataRoute.datasetIterator + 1 }): 
            setDataRoute({ routeIterator: dataRoute.routeIterator + 1, datasetIterator: dataRoute.datasetIterator })
            
    }

    function setPropsToPass() {
        // console.log(currentKey, route); this is the log to troubleshoot if needed
        propsToPass.length = 0;
        //route = key : currentKey = value ....ie, 'stackedBar' : 'weeklyWeather'
        const ROUTES = {
            stackedBarChutes: <BarChart dataToGraph={propsToPass} title={route} />,
            stackedBarFletcher: <BarChart dataToGraph={propsToPass} title={route}/>,
            stackedBarVortex: <BarChart dataToGraph={propsToPass} title={route}/>,
            stackedBarMarie: <BarChart dataToGraph={propsToPass} title={route}/>,
            donutGraph: <DonutGraph dataToGraph={propsToPass} />,
            singleBar: <BarChart dataToGraph={propsToPass} />,
            listMostCompleted: <EmojiList dataToGraph={propsToPass} title={route}/>,
            listMostStarted: <EmojiList dataToGraph={propsToPass} title={route} />
        }
        
        let weeklyData = Object.values(dataSet);
        if (currentKey === 'omoGames') {
            let gameProps = weeklyData[dataRoute.routeIterator].finishedGames;
            
            // console.log(gameProps, storyProps);
            
            //if json response has different key names you will not have to slice the response here
            //will likely destructure the first data response also...
            gameProps.map((d) => {
                let propToPass = {};
                let { finished: dataSet0, started: dataSet1 = 0, day: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.push(propToPass);
            }) 
        } else if (currentKey === 'omoStories') {
            let storyProps = weeklyData[dataRoute.routeIterator].stories;
            storyProps.map((d) => {
                let propToPass = {};
                let { finished: dataSet0, started: dataSet1 = 0, day: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.push(propToPass);
            })
        }
        // console.log(currentKey, route);
        console.log(propsToPass);
        
        return (
            <div>
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