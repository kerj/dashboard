import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import EmojiList from './EmojiList';

export default class testsets extends Component {

    componentDidMount(){
        this.changeCurrentRoute();
    }

    changeCurrentRoute = () => {
        let dataToCycle = Object.keys(props.stateHelper).slice(3);//an array of keys avail
        //i is routes inside of the current j position
        let i = 0;
        //j is key from state object
        let j = 0;
        let routesAvailable = props.stateHelper[`${dataToCycle[j]}`].routes;
        setInterval(() => {
            if (i >= props.stateHelper[`${dataToCycle[j]}`].routes.length - 1) {
                j++
                if (j > dataToCycle.length - 1) {
                    j = 0
                    routesAvailable = props.stateHelper[`${dataToCycle[j]}`].routes;
                }
                routesAvailable = props.stateHelper[`${dataToCycle[j]}`].routes;
                i = 0
            } else {
                i++
            }
            passProps(route);
        }, 3000);

    }

    passProps = (currentRoute) => {
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
        

    }

    render() {
        const ROUTES = {
            stackedBar: <BarChart dataToGraph={propsToPass} />,
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
}

RouteManager.propTypes = {
    stateHelper: PropTypes.object.isRequired
}
