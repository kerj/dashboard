import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';

export default function RouteManager(props) {
    let dataToCycle = Object.keys(props.stateHelper).slice(1);
    let [dataRoute, setDataRoute] = useState({ routeIterator: 0, datasetIterator: 0 })
    let routesAvailable = props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes;
    let [route, setRoute] = useState(props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes[dataRoute.routeIterator]);

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
                setDataRoute({ routeIterator: 0, datasetIterator: 0 })
                : setDataRoute({ routeIterator: 0, datasetIterator: dataRoute.datasetIterator + 1 })
            : setDataRoute({ routeIterator: dataRoute.routeIterator + 1, datasetIterator: dataRoute.datasetIterator })

        setRoute(props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes[dataRoute.routeIterator]);
    }

    function setPropsToPass() {
        let currentKey = dataToCycle[dataRoute.datasetIterator];
        propsToPass.lenth = 0;
        //route = key : currentKey = value ....ie, 'stackedBar' : 'weeklyWeather'
        const ROUTES = {
            stackedBar: <BarChart dataToGraph={propsToPass} />,
            donutGraph: <DonutGraph dataToGraph={propsToPass} />,
            singleBar: <BarChart dataToGraph={propsToPass} />,
            emojiList: <EmojiList dataToGraph={propsToPass} />,
        }
        if (currentKey === 'ohs') {
            let weeklyData = [];
            // 0-28 dataRoute.routeIterator === 0,1,2,3
            dataRoute.routeIterator === 0 ? weeklyData = dataSet.slice(0, 7) : 
            dataRoute.routeIterator === 1 ? weeklyData = dataSet.slice(7,14) :
            dataRoute.routeIterator === 2 ? weeklyData = dataSet.slice(14,21) : 
            weeklyData = dataSet.slice(21,28) 
            
            console.log(weeklyData);
            
            //if json response has different key names you will not have to slice the response here
            //will likely destructure the first data response also...
            
            weeklyData.map((d) => {
                let propToPass = {};
                let { started: dataSet0, finished: dataSet1 = 0, day: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.push(propToPass);
            })
        } else if (currentKey === 'farAwayWeather') {
            let farAwayData = dataSet.slice(6, 12);
            farAwayData.map((d) => {
                let propToPass = {};
                let { max_temp: dataSet0, min_temp: dataSet1 = 0, applicable_date: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.push(propToPass);
            })
        }
        console.log(currentKey, route);
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