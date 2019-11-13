import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import './../scss/barChart.scss'

//there are two types of stacked bar graphs need a way to tell between the two
//one has an addition of the stacks the other has to show the difference between the stacks
export default class BarChart extends Component {

    componentDidMount() {
        this.drawBarChart(this.props.dataToGraph)
    }

    drawBarChart(data) {
        var margin = { top: 100, right: 80, bottom: 100, left: 140 }
        var width = 1060 - margin.left - margin.right
        var height = 1900 - margin.top - margin.bottom
        //container for graph
        let svgCanvas = d3.select(this.refs.canvas)
            .append("svg")
            .attr("class", this.props.title)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            //moves whole canvas
            .attr('transform', 'translate(0,10)')
            .append('g')
            //moves info inside of canvas
            .attr('transform', 'translate(140,' + margin.top + ')')
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
            .rangeRound([0, width - 20])
            .domain([0, d3.max(stack, (d) => {
                if (this.props.title === "NEW VS. RETURNING VISITORS") {
                    return d3.max(d, (d) => d[1])
                } else {
                    return d3.max(d, (d) => d[0])
                }
            })])

        let y = d3.scaleBand()
            .rangeRound([height, 0])
            .padding([.3])
            .domain(data.map((d) => {
                return d.labels
            }))

        let legend = svgCanvas.selectAll(".legend")
            .data(stack)
            .enter().append('g')
            .attr("transform", (d, i) => {
                return "translate(" + (width - 90) + "," + (i * 15) + ")";
            })
            .attr("class", "legend")

        legend.append("rect")
            .attr("width", 20)
            .attr("height", 15)
            .attr('y', -35)
            .attr('x', -200)
            .attr("class", (d, i) => {
                return 'set' + i
            })
        // svf = start vs finish, nvr = new vs returning
        legend.append('text')
            .attr('class', `${this.props.title === "NEW VS. RETURNING VISITORS" ? 'NVR' : 'SVF'}`)
            .text((d) => {
                if (d3.select('text').classed('NVR')) {
                    if (d.key === 'dataSet1') {
                        return 'NEW'
                    } return 'RETURNING'
                } else {
                    if (d.key === 'dataSet0') {
                        return 'STARTED'
                    } return 'COMPLETED'
                }
            })
            .style('fill', 'whitesmoke')
            .style("font-size", 20)
            .attr('y', -20)
            .attr('x', -175)

        //title at the top of barchart
        svgCanvas.append('g')
            .attr("class", "x axis")
            .call(x)
            .append("text")
            .style("fill", "whitesmoke")
            .style("font-size", 50)
            .attr("x", 500)
            .attr("y", -20)
            .attr("dx", ".71em")
            .attr("transform", "rotate(-360)")
            .style("text-anchor", "end")
            .text(`${this.props.title}`)
        //x axis
        svgCanvas.append('g')
            .attr('class', 'x axis')
            .attr("transform", "translate(0, 1720)")
            .style("color", "whitesmoke")
            .style('font-size', 40)
            .call(d3.axisBottom(x)
                .ticks(5)
                .tickSize([0]))
                .select('path.domain').remove()
        //y axis
        svgCanvas.append('g')
            .attr('class', 'y axis')
            .attr("transform", "translate(-20, 0)")
            .style('font-size', 40)
            .style("color", "whitesmoke")
            .call(d3.axisLeft(y)
            .tickSize([0]))
            .select('path.domain').remove()
            .select('text')

        

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
                if (this.props.title === "NEW VS. RETURNING VISITORS") {
                    return x(d[0])
                } else {
                    return x(d)
                }
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