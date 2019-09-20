import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import './../scss/barChart.scss'

//there are two types of stacked bar graphs need a way to tell between the two
//one has a addition of the stacks the other has to show the difference between the stacks
export default class BarChart extends Component {

    componentDidMount() {
        this.drawBarChart(this.props.dataToGraph)
    }

    drawBarChart(data) {
        var margin = { top: 40, right: 20, bottom: 40, left: 40 }
        var width = 400 - margin.left - margin.right
        var height = 600 - margin.top - margin.bottom
        //container for graph
        let svgCanvas = d3.select(this.refs.canvas)
            .append("svg")
            .attr("class", this.props.title)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
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
            .rangeRound([0, width - 20])
            .domain([0, d3.max(stack, (d) => {
                if(this.props.title === "NEW VS. RETURNING VISITORS"){
                    return d3.max(d, (d) => d[1])
                }else {
                    return d3.max(d, (d) => d[0])
                }
            })])
    
        let y = d3.scaleBand()
            .range([height, 0])
            .padding(0.1)
            .domain(data.map((d) => {
                return d.labels
            }))

        let legend = svgCanvas.selectAll(".legend")
            .data(stack)
            .enter().append('g')
            .attr("transform", (d, i) => {
                return "translate(" + (width - 110) + "," + (i * 15 + 20) + ")";
            })
            .attr("class", "legend")

        legend.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("class", (d, i) => {
                return 'set' + i
            })
        //how to make this change with the dataset...
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
            .style("font-size", 12)
            .attr('y', 10)
            .attr('x', 11)

        //title at the top of barchart
        svgCanvas.append('g')
            .attr("class", "x axis")
            .call(x)
            .append("text")
            .style("fill", "whitesmoke")
            .style("font-family", "Impact, Charcoal, sans-serif")
            .attr("x", 250)
            .attr("dx", ".71em")
            .attr("transform", "rotate(-360)")
            .style("text-anchor", "end")
            .text(`${this.props.title}`)
        //x axis
        svgCanvas.append('g')
            .attr('class', 'x axis')
            .attr("transform", "translate(0, " + height + ")")
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
                if (this.props.title === "NEW VS. RETURNING VISITORS"){
                    return x(d[0])
                }else{
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