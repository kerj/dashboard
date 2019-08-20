import React, { Component } from 'react';
import * as d3 from 'd3';
import BarChart from './BarChart';
const axios = require('axios');



class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            weeklyWeather: []
        }
    }

    
    fetchWeatherData = () => {
        let weatherQuery = "https://www.metaweather.com/api/location/2475687/";
        axios.get(weatherQuery).then((response) => {
            const weatherResponse = response.data.consolidated_weather;
            let days = [];
            weatherResponse.map((day) => {
                let newDay = new Object();
                newDay.fahrenheitMaxTemp = Math.floor((day.max_temp * (9 / 5)) + 32);
                newDay.fahrenheitMinTemp = Math.floor((day.min_temp * (9 / 5)) + 32);
                newDay.date = day.applicable_date;
                days.push(newDay);
            })
            this.setState({ weeklyWeather: days });
            this.displayText();
        })
    }

    displayText = () => {
        d3.select(this.refs.temperatures)
            .selectAll("li")
            .data(this.state.weeklyWeather)
            .enter()
            .append("li")
            .text((datapoint) => {
                //runs once for first array then again for the second 
                return `${datapoint.fahrenheitMaxTemp} degrees on ${datapoint.date}`
            })
            .style("color", "slategrey")
            .attr("class", (datapoint) => {
                if (datapoint > 79) {
                    return "higherTempurature"
                } else { return "lowerTempurature" }
            })
            .transition()
            .delay(1000)
            .duration(1000)
            .style("color", "black")
    }

    componentDidMount() {
        //fetch data to display with d3
        this.fetchWeatherData()
    }

    render() {
        return (
            <div>
                {this.state.weeklyWeather.length <= 5
                    ? <h1>Loading Graph</h1>
                    : <BarChart dataToGraph={this.state.weeklyWeather}  />
                }
                <ul ref="temperatures">
                </ul>
            </div>
        )
    }
}


export default D3Test;
