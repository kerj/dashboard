import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';

export default function RouteManager(props) {
    //the route list needs to be dynamic here~~ something like dataToCycle[]
    let dataToCycle = Object.keys(props.stateHelper).slice(3);
    let [dataRoute, setDataRoute ] = useState({
        routeIterator: 0,
        datasetIterator: 0
    })
    let routesAvailable = props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes;
    let [route, setRoute] = useState(props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes[`${routesAvailable[dataRoute.routeIterator]}`]);

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
        setPropsToPass();
        updateRoute();
    }, 6000)

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
        // console.log("data keys", dataToCycle.length,"routes within current dataKey", routesAvailable.length);
        if (dataRoute.routeIterator + 1 > routesAvailable.length - 1 || !routesAvailable.length === 2) {
            if (dataRoute.datasetIterator + 1 > dataToCycle.length -1) {
                setDataRoute({
                    routeIterator: 0,
                    datasetIterator: 0
                })
            } else {
                setDataRoute({
                    routeIterator: 0,
                    datasetIterator: dataRoute.datasetIterator + 1
                })
            }
        } else {
            setDataRoute({
                routeIterator: dataRoute.routeIterator + 1,
                datasetIterator: dataRoute.datasetIterator
            })
        };
        setRoute(props.stateHelper[`${dataToCycle[dataRoute.datasetIterator]}`].routes[dataRoute.routeIterator]);
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