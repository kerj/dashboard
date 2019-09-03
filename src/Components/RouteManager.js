import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';

export default function RouteManager(props) {
    let dataToCycle = Object.keys(props.stateHelper).slice(1);
    let [dataRoute, setDataRoute] = useState({ routeIterator: 0, datasetIterator: 0 })
    let currentKey = dataToCycle[dataRoute.datasetIterator];
    let routesAvailable = props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes;
    let [route, setRoute] = useState(props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes[`${routesAvailable[dataRoute.routeIterator]}`]);
    let propsToPass = [];

    const dataSet = props.stateHelper.data;
  
    //routes change every 15 seconds
    useInterval(() => {
        setPropsToPass();
        updateRoute();
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
        dataRoute.routeIterator + 1 > routesAvailable.length - 1 || !routesAvailable.length === 2 ?
        dataRoute.datasetIterator + 1 > dataToCycle.length - 1 ?
            setDataRoute({routeIterator: 0, datasetIterator: 0}) 
            : setDataRoute({routeIterator: 0, datasetIterator: dataRoute.datasetIterator + 1}) 
        : setDataRoute({routeIterator: dataRoute.routeIterator + 1, datasetIterator: dataRoute.datasetIterator})

        setRoute(props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes[dataRoute.routeIterator]);
    }

    function setPropsToPass() {
        console.log(route, currentKey);
        //route = key : currentKey = value ....ie, 'stackedBar' : 'weeklyWeather'
        const ROUTES = {
            stackedBar: <BarChart dataToGraph={propsToPass} />,
            donutGraph: <DonutGraph dataToGraph={propsToPass} />,
            singleBar: <BarChart dataToGraph={propsToPass} />,
            emojiList: <EmojiList dataToGraph={propsToPass} />,
        }

        if (currentKey === 'weeklyWeather') {
            let weeklyData = dataSet.slice(0,6);
            weeklyData.map((d) => {
                let propToPass = new Object;
                let { max_temp: dataSet0, min_temp: dataSet1 = 0, applicable_date: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.splice(0,propToPass);
            })
            console.log(propsToPass);
            
        }else if (currentKey === 'farAwayWeather'){
            let farAwayData = dataSet.slice(6,12);
            farAwayData.map((d) => {
                let propToPass = new Object;
                let { max_temp: dataSet0, min_temp: dataSet1 = 0, applicable_date: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.splice(0,propToPass);
            })
            console.log(propsToPass); 
        }
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