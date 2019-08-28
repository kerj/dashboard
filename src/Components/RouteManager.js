import React from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';


export default function RouteManager(props) {
    let route = props.stateHelper.currentRoute,
        propsToPass = props.stateHelper.weeklyWeather;

    //this function needs to be refactored => responsible for passing props
    function passProps(currentRoute) {
        //build propsToPass which is passed to graph/list/chart components
        propsToPass = [];
        //if there is weather data to display it will route here 
        if (currentRoute && props.stateHelper.weeklyWeather.length > 0) {
            props.stateHelper.weeklyWeather.map((d) => {
                let propToPass = new Object;
                let i = propsToPass.length
                let { max_temp: dataSet0, min_temp: dataSet1 = 0, applicable_date: labels } = d
                propToPass.dataSet0 = `${dataSet0}`
                propToPass.dataSet1 = `${dataSet1}`
                propToPass.labels = `${labels}`
                propsToPass.push(propToPass);
            })
        }
    }
    passProps(route);
    const ROUTES = {
        barChart: <BarChart dataToGraph={propsToPass} />,
        donutGraph: <DonutGraph dataToGraph={propsToPass} />,
        singleBar: <BarChart dataToGraph={propsToPass} />,
        emojiList: <EmojiList dataToGraph={propsToPass} />,
    }
    return (
        <div>
            {ROUTES[route]}
        </div>
    )
}

RouteManager.propTypes = {
    stateHelper: PropTypes.object.isRequired
}