import React from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';


export default function RouteManager(props) {
    let route = props.stateHelper.currentRoute,
        propsToPass = props.stateHelper.weeklyWeather;
    //dependent on the route, propsToPass should be different
    //call functions to clean data here before passing them as props if needed
    function passProps(currentRoute) {
        //each object should just have one property each
            propsToPass = [];
        
        //idea to add the needed props into this map function that will clean data for the graphs
        if (currentRoute) {
            props.stateHelper.weeklyWeather.map((d) => {
                let propToPass = new Object;
                let i = propsToPass.length
                let { max_temp: dataSet0, min_temp: dataSet1, applicable_date: labels } = d
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