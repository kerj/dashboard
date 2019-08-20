import React, { Component } from 'react';
import * as d3 from 'd3';
import BarChart from './BarChart';
const axios = require('axios');



class D3Test extends Component {

    constructor(props) {
        super(props)
        this.state = {
            temperatureData: [],
            date: []
        }
    }

    fetchWeatherData = () => {
        let weatherQuery = "https://www.metaweather.com/api/location/2475687/";
        axios.get(weatherQuery).then((response) => {
            const weatherResponse = response.data.consolidated_weather;
            let newTemperatureData = [...this.state.temperatureData];
            let newDateData = [...this.state.date];
            weatherResponse.map((day) => {
                let fahrenheitTemp = Math.floor((day.max_temp * (9 / 5)) + 32);
                let date = day.applicable_date;
                newDateData.push(date);
                newTemperatureData.push(fahrenheitTemp);
                this.setState({ temperatureData: newTemperatureData });
                this.setState({ date: newDateData })
            })
            console.log(this.state);

            this.displayText();
        })
    }

    displayText = () => {
        d3.select(this.refs.temperatures)
            .selectAll("li")
            .data(this.state.temperatureData)
            .enter()
            .append("li")
            .text((datapoint) => `${datapoint} degrees on `)
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
                {this.state.temperatureData.length <= 5
                    ? <h1>Loading Graph</h1>
                    : <BarChart tempuratureDataToGraph={this.state.temperatureData} />
                }
                <ul ref="temperatures">
                </ul>
            </div>
        )
    }
}

export default D3Test;
