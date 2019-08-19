import React, { Component } from 'react';
import * as d3 from 'd3';


// .style((datapoint) => {
//     if (datapoint > 10) {
//         return "red";
//     } else {
//         return "hsl(" + Math.random() * 360 + ",100%,50%)";
//     }
// })


class D3Test extends Component {

    componentDidMount() {
        //fetch data to display with d3
        const temperatureData = [8, 5, 13, 9, 12];
    
        
        //select the data with d3 and go wild
        
        d3.select(this.refs.temperatures)
            .selectAll("h2")
            .data(temperatureData)
            .enter()
            .append("h2")
            .text((datapoint) => `${datapoint} degrees`)
            .attr("class", (datapoint) => { datapoint > 10 ? "highTempurature" : "lowTempurature" })
    }

    render() {
        return (
            <div ref="temperatures">

            </div>
        )
    }
}
export default D3Test;
