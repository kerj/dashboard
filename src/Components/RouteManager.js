import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';

export default function RouteManager(props) {

    let route = props.stateHelper[`${props.stateHelper.currentKey}`].routes[`${props.stateHelper.currentRoute}`],
        dataSet = props.stateHelper.data,
        propsToPass = [],
        i = 0,
        j = 0;
        let dataToCycle = Object.keys(props.stateHelper).slice(3);
        let routesAvailable = props.stateHelper[`${dataToCycle[j]}`].routes;


    //routes change every 15 seconds

    useEffect(() => {
        console.log(j,i);
        passProps(route)
    }, [route])

    function changeCurrentRoute() {
        if (i + 1 > routesAvailable.length - 1 || routesAvailable.length === 1) {
          //change the key if j = 1
            if (j + 1 > dataToCycle.length -1) {
                j = 0
                i = 0
                route = props.stateHelper[`${dataToCycle[j]}`].routes[i]; 
                routesAvailable = props.stateHelper[`${dataToCycle[j]}`].routes 
                console.log(j,i);
                passProps(route);
            }else {
                j++
                i = 0
                route = props.stateHelper[`${dataToCycle[j]}`].routes[i];
                console.log(j, i);
                passProps(route)
                routesAvailable = props.stateHelper[`${dataToCycle[j]}`].routes
            }
        } else {
            route = props.stateHelper[`${dataToCycle[j]}`].routes[i];
            i++
            console.log(j, i);
            passProps(route); 
        }
    }
    // this function needs to be refactored => responsible for passing props
    function passProps(currentRoute) {
        setTimeout(() => {
            changeCurrentRoute()
        }, 5000);
        const ROUTES = {
            stackedBar: <BarChart dataToGraph={propsToPass} />,
            donutGraph: <DonutGraph dataToGraph={propsToPass} />,
            singleBar: <BarChart dataToGraph={propsToPass} />,
            emojiList: <EmojiList dataToGraph={propsToPass} />,
        }
        if (currentRoute) {
            dataSet.map((d) => {
                let propToPass = new Object;
                let i = propsToPass.length
                let { max_temp: dataSet0, min_temp: dataSet1 = 0, applicable_date: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.push(propToPass);
            })
        }
        return (
            <div>
                {ROUTES[route]}
            </div>
        )
    }

    return (
        <div>
            {passProps(route)}
        </div>
    )
}

RouteManager.propTypes = {
    stateHelper: PropTypes.object.isRequired
}