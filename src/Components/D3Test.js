import React, { Component } from 'react';
import * as d3 from 'd3';
import BarChart from './BarChart';
const axios = require('axios');



class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            temperatureData: []
        }
    }

    fetchWeatherData = () => {
        let weatherQuery = "https://www.metaweather.com/api/location/2475687/";
        axios.get(weatherQuery).then((response) => {
            const weatherResponse = response.data.consolidated_weather;
            weatherResponse.map((day) => {
                let newTemperatureData = [...this.state.temperatureData];
                newTemperatureData.push(day.max_temp);

                this.setState({ temperatureData: newTemperatureData })
                console.log(this.state.temperatureData);

            })
        })
    }

    displayText() {
        d3.select(this.refs.temperatures)
            .selectAll("h2")
            .data(this.state.temperatureData)
            .enter()
            .append("h2")
            .text((datapoint) => `${datapoint} degrees`)
            .style("color", "slategrey")
            .attr("class", (datapoint) => {
                if (datapoint > 10) {
                    return "highTempurature"
                } else { return "lowTempurature" }
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
            <div ref="temperatures">
                <BarChart tempuratureDataToGraph={this.state.temperatureData} />
            </div>
        )
    }
}

export default D3Test;
