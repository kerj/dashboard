import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import './../scss/barChart.scss'

export default class BarChart extends Component {

    componentDidMount() {
        this.drawBarChart(this.props.dataToGraph)
    }

    drawBarChart(data) {
        var margin = { top: 40, right: 20, bottom: 40, left: 40 }
        var canvasWidth = 400 - margin.left - margin.right
        var canvasHeight = 600 - margin.top - margin.bottom
        //container for graph
        let svgCanvas = d3.select(this.refs.canvas)
            .append("svg")
            .attr("class", this.props.title)
            .attr("width", canvasWidth + margin.left + margin.right)
            .attr("height", canvasHeight + margin.top + margin.bottom)
            //moves whole canvas
            .attr('transform', 'translate(100,10)')
            .append('g')
            //moves info inside of canvas
            .attr('transform', 'translate(60,' + margin.top + ')')
        //get the data to stack bars keys need to become variable

        let stack = d3.stack()
            .keys(['dataSet0', 'dataSet1'])
            .offset(d3.stackOffsetNone)(data)

        var g = d3.select('g')
            .selectAll('g')
            .attr("class", this.props.title)
            .data(stack)
            .enter()
            .append('g')
            .attr("class", (d, i) => {
                return 'set' + i;
            })

        let x = d3.scaleLinear()
            .rangeRound([0, canvasWidth - 20])
            .domain([0, d3.max(stack, (d) => {
                return d3.max(d, (d) => d[1])
            })])

        let y = d3.scaleBand()
            .range([canvasHeight, 0])
            .padding(0.1)
            .domain(data.map((d) => {
                return d.labels
            }))

        svgCanvas.append('g')
            .attr("class", "x axis")
            .call(x)
            .append("text")
            .style("fill", "whitesmoke")
            .attr("x", 250)
            .attr("dx", ".71em")
            .attr("transform", "rotate(-360)")
            .style("text-anchor", "end")
            .text(`${this.props.title}`)
        //x axis
        svgCanvas.append('g')
            .attr('class', 'x axis')
            .attr("transform", "translate(0, " + canvasHeight + ")")
            .style("color", "whitesmoke")
            .call(d3.axisBottom(x))
        //y axis
        svgCanvas.append('g')
            .attr('class', 'y axis')
            .style("color", "whitesmoke")
            .call(d3.axisLeft(y))
        //Bar Data to graph
        g.selectAll('rect')
            .data((d) => {
                return d;
            })
            .enter().append('rect')
            .transition()
            .delay((d, i) => {
                return i * 100;
            })
            .duration(1000)
            .ease(d3.easeSinInOut)
            .attr('x', (d, i) => {
                return x(d[0])
            })
            .attr('y', (d) => {
                return y(d.data.labels)
            })
            .attr('width', (d) => {
                return x((d[1] - d[0]))
            })
            .attr('height', y.bandwidth())
    }
    render() {
        return (
            <div ref='canvas'>
            </div>
        )
    }
}

BarChart.propTypes = {
    dataToGraph: PropTypes.array.isRequired,
    title: PropTypes.any
}