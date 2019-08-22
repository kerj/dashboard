import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

export default class BarChart extends Component {

    componentDidMount() {
        this.drawBarChart(this.props.dataToGraph)
    }


    drawBarChart(data) {
        var margin = { top: 40, right: 20, bottom: 40, left: 40 }
        var canvasWidth = 400 - margin.left - margin.right
        var canvasHeight = 600 - margin.top - margin.bottom

        //container for graph
        const svgCanvas = d3.select(this.refs.canvas)
            .append("svg")
            .attr("width", canvasWidth + margin.left + margin.right)
            .attr("height", canvasHeight + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

        let stack = d3.stack()
            .keys(['fahrenheitMinTemp', 'tempDifference'])
            .offset(d3.stackOffsetDiverging)(data)

        var colors = ['#00D7D2', '#FF4436', '#313c53'];

        var g = d3.select('g')
            .selectAll('g.addColor')
            .data(stack)
            .enter()
            .append('g')
            .classed('addColor', true)
            .style('fill', (d, i) => {
                return colors[i];
            });

        let x = d3.scaleBand()
            .rangeRound([0, canvasWidth])
            .padding(0.1)

        let y = d3.scaleLinear()
            .range([canvasHeight, 0])

        x.domain(data.map((d) => {
            return d.date
        }))

        y.domain([0, d3.max(stack, (d) => {
            return d3.max(d, (d) => d[1])
        })])

        //x axis
        svgCanvas.append('g')
            .attr('class', 'x axis')
            .attr("transform", "translate(0, " + canvasHeight + ")")
            .call(d3.axisBottom(x))

        //y axis
        svgCanvas.append('g')
            .attr('class', 'y axis')
            .call(d3.axisLeft(y))

        //Bar Data to graph
        g.selectAll('rect')
            .data((d) => {
                return d;
            })
            .enter().append('rect')
            .attr('height', (d) => {
                return y(d[0]) - y(d[1]);
            })
            .attr('y', (d) => {

                return y(d[1])
            })
            .attr('x', (d, i) => {
                return x(d.data.date)
            })
            .attr('width', x.bandwidth());


        //data to display as single bars
        // svgCanvas.selectAll("rect")
        //     .data(data).enter()
        //     .append("rect")
        //     .attr("width", 40)
        //     .attr("height", (d) => d)
        //     .attr("fill", "whitesmoke")
        //     .attr("x", (d, iteration) => iteration * 45)
        //     .attr("y", (d) => canvasHeight - d)
        //     .transition()
        //     .delay(750)
        //     .duration(1000)
        //     .attr("fill", (d) => {
        //         if(d > 79) {
        //             return "red"
        //         }else { return "blue"}
        //     })

        // //text values with the bars
        // svgCanvas.selectAll("text")
        //     .data(data).enter()
        //     .append("text")
        //     .attr("x", (d, i) => i * 45 + 10)
        //     .attr("y", (d, i) => canvasHeight - d - 10)
        //     .text(d => d) 
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
