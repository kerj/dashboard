import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';

export default function RouteManager(props) {
    let [route, setRoute] = useState(props.stateHelper[`${props.stateHelper.currentKey}`].routes[`${props.stateHelper.currentRoute}`]);
    let propsToPass = [];
    let dataSet = props.stateHelper.data,
        i = 0,
        j = 0;
    let dataToCycle = Object.keys(props.stateHelper).slice(3);
    let routesAvailable = props.stateHelper[`${dataToCycle[j]}`].routes;

    const ROUTES = {
        stackedBar: <BarChart dataToGraph={propsToPass} />,
        donutGraph: <DonutGraph dataToGraph={propsToPass} />,
        singleBar: <BarChart dataToGraph={propsToPass} />,
        emojiList: <EmojiList dataToGraph={propsToPass} />,
    }

    //routes change every 15 seconds
    useInterval(() => {
        updateRoute()
    }, 15000)

    function useInterval(callback, delay) {
        const savedClallback = useRef();

        useEffect(() => {
            savedClallback.current = callback;
        }, [callback]);

        useEffect(() => {
            function tick() {
                savedClallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay])
    }

    function updateRoute() {
        if (i + 1 > routesAvailable.length - 1 || routesAvailable.length === 1) {
            if (j + 1 > dataToCycle.length - 1) {
                j = 0
                i = 0
                setRoute(props.stateHelper[`${dataToCycle[j]}`].routes[i]);
                routesAvailable = props.stateHelper[`${dataToCycle[j]}`].routes
            } else {
                j++
                i = 0
                setRoute(props.stateHelper[`${dataToCycle[j]}`].routes[i]);
                routesAvailable = props.stateHelper[`${dataToCycle[j]}`].routes
            }
        } else {
            i++
            setRoute(props.stateHelper[`${dataToCycle[j]}`].routes[i]);
        }
    }

    function setPropsToPass(currentRoute) {
        dataSet.map((d) => {
            let propToPass = new Object;
            let i = propsToPass.length
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
            {setPropsToPass(route)}
        </div>
    )
}

RouteManager.propTypes = {
    stateHelper: PropTypes.object.isRequired
}