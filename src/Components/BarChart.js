import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

export default class BarChart extends Component {

    componentDidMount() {
        let maxTemps = this.props.dataToGraph.map(({ fahrenheitMaxTemp }) => fahrenheitMaxTemp)
        let minTemps = this.props.dataToGraph.map(({ fahrenheitMinTemp }) => fahrenheitMinTemp)
        let dates = this.props.dataToGraph.map(({ date }) => date)
        this.drawBarChart(maxTemps)
    }

    drawBarChart(data) {
        const canvasHeight = 400
        const canvasWidth = 600
        const scale = 2
        //container for graph
        const svgCanvas = d3.select(this.refs.canvas)
            .append("svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight)
            .style("border", "1px solid black")

        //data to display as bars
        svgCanvas.selectAll("rect")
            .data(data).enter()
            .append("rect")
            .attr("width", 40)
            .attr("height", (datapoint) => datapoint * scale)
            .attr("fill", "whitesmoke")
            .attr("x", (datapoint, iteration) => iteration * 45)
            .attr("y", (datapoint) => canvasHeight - datapoint * scale)
            .transition()
            .delay(750)
            .duration(1000)
            .attr("fill", (datapoint) => {
                if(datapoint > 79) {
                    return "red"
                }else { return "blue"}
            })

        //text values with the bars
        svgCanvas.selectAll("text")
            .data(data).enter()
            .append("text")
            .attr("x", (dataPoint, i) => i * 45 + 10)
            .attr("y", (dataPoint, i) => canvasHeight - dataPoint * scale - 10)
            .text(dataPoint => dataPoint) 
    }

    

    render() {
        return (
            <div ref="canvas">
            </div>
        )
    }
}

BarChart.propTypes = {
    dataToGraph: PropTypes.array.isRequired,
}
