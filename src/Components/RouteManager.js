import React from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';


export default function RouteManager(props) {
    console.log(props);
    
    let route = props.stateHelper.currentRoute,
        propsToPass = props.stateHelper.weeklyWeather;

    //call functions to clean data here before passing them as props if needed

    const ROUTES = {
        barChart : <BarChart dataToGraph={propsToPass} />,
        donutGraph: <DonutGraph dataToGraph={propsToPass} />,
        singleBar: <BarChart dataToGraph={propsToPass} />,
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