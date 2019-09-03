import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';

export default function RouteManager(props) {
    //the route list needs to be dynamic here~~ something like dataToCycle[]
    let [route, setRoute] = useState(props.stateHelper[`${props.stateHelper.currentKey}`].routes[`${props.stateHelper.currentRoute}`]);
    let [routeIterator, setRouteIterator] = useState(0);
    let [datasetIterator, setDatasetIterator] = useState(0);

    let dataToCycle = Object.keys(props.stateHelper).slice(3);
    
    
    let routesAvailable = props.stateHelper[`${dataToCycle[datasetIterator]}`].routes;
    console.log(props.stateHelper[`${props.stateHelper.currentKey}`]);
    
    
    let propsToPass = [];
    const dataSet = props.stateHelper.data;
    
    const ROUTES = {
        stackedBar: <BarChart dataToGraph={propsToPass} />,
        donutGraph: <DonutGraph dataToGraph={propsToPass} />,
        singleBar: <BarChart dataToGraph={propsToPass} />,
        emojiList: <EmojiList dataToGraph={propsToPass} />,
    }

    //routes change every 15 seconds
    useInterval(() => {
        updateRoute()
    }, 3000)

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

    function updateRoute() {
        if (routeIterator + 1 > routesAvailable.length - 1 || routesAvailable.length === 2) {
            if (datasetIterator + 1 > dataToCycle.length - 1) {
                setDatasetIterator(datasetIterator = 0)
                setRouteIterator(routeIterator = 0)
                setRoute(props.stateHelper[`${dataToCycle[datasetIterator]}`].routes[routeIterator]);
            } else {
                setDatasetIterator(datasetIterator + 1)
                setRouteIterator(routeIterator = 0) 
                setRoute(props.stateHelper[`${dataToCycle[datasetIterator]}`].routes[0]);
            }
        } else {
            setRouteIterator(routeIterator + 1)
            setRoute(props.stateHelper[`${dataToCycle[datasetIterator]}`].routes[routeIterator]);  
        }
    }

    function setPropsToPass() {
        dataSet.map((d) => {
            let propToPass = new Object;
            let { max_temp: dataSet0, min_temp: dataSet1 = 0, applicable_date: labels } = d
            propToPass.dataSet0 = `${dataSet0}`
            propToPass.dataSet1 = `${dataSet1}`
            propToPass.labels = `${labels}`
            propsToPass.push(propToPass);
        })
        
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