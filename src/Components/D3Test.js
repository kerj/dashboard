import React, { Component } from 'react';
import * as d3 from 'd3';





class D3Test extends Component {

    componentDidMount(){
        const temperatureData = [8, 5, 13, 9, 12];
        
        d3.select(this.refs.temperatures)
            .selectAll("h2")
            .data(temperatureData)
            .enter()
                .append("h2")
                .text((datapoint) => datapoint + " degrees")
    }
    
    render() {
        return (
            <div ref="temperatures">
                
            </div>
        )
    }
}
export default D3Test;
