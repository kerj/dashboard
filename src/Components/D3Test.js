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
            //will make new object with only required data and update state
            weatherResponse.map((day) => {
                let newDay = new Object();
                newDay.fahrenheitMaxTemp = Math.floor((day.max_temp * (9 / 5)) + 32);
                newDay.fahrenheitMinTemp = Math.floor((day.min_temp * (9 / 5)) + 32);
                newDay.tempDifference = newDay.fahrenheitMaxTemp - newDay.fahrenheitMinTemp;
                newDay.date = day.applicable_date;
                days.push(newDay);
            })
            //state updates with array of newDay{}'s
            this.setState({ weeklyWeather: days });
            this.displayText();
        })
    }

    displayText = () => {
        //this shows as text what is displayed in the barchart
        d3.select(this.refs.temperatures)
            .selectAll("li")
            .data(this.state.weeklyWeather)
            .enter()
            .append("li")
            .text((datapoint) => { 
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
                {/* won't render BarChart until the the weeks weather is returned */}
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
