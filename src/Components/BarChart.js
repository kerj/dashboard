import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import './../scss/barChart.scss'

//there are two types of stacked bar graphs need a way to tell between the two
//one has an addition of the stacks the other has to show the difference between the stacks
export default class BarChart extends Component {
    componentDidUpdate(prevProps, prevState, snapshot) {
        this.drawBarChart(this.props.dataToGraph)
    }

    drawBarChart(data) {
        var margin = { top: 350, right: 200, bottom: 355, left: 200 }
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
            .attr('transform', 'translate(338, 385)')
        //get the data to stack bars keys need to become variable

        let stack = d3.stack()
            .keys(['dataSet0', 'dataSet1'])
            .offset(d3.stackOffsetNone)(data)

        var g = d3.select('g')
            .selectAll('g')
            .attr("class", this.props.title)
            .data(stack)
            .enter()
            .append('g');

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
            .padding([.55])
            .domain(data.map((d) => {
                return d.labels
            }))

        //x axis
        svgCanvas.append('g')
            .attr('class', 'x axis')
            .attr("transform", "translate(0, 1217)")
            .style('font-family', 'Montserrat')
            .style('font-weight', 'bold')
            .style('font-size', 48)
            .style('letter-spacing', 2)
            .style("color", "whitesmoke")
            .call(d3.axisBottom(x)
                .ticks(3)
                .tickSize([0]))
            .select('path.domain').remove()

        //y axis
        svgCanvas.append('g')
            .attr('class', 'y axis')
            .attr("transform", "translate(-60, 0)")
            .style('font-family', 'Montserrat')
            .style('font-weight', 'bold')
            .style('font-size', 48)
            .style('letter-spacing', 0)
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
            .style('fill', (d) => {
                //when starting data at zero, prop.props.colorOne
                return d[0] === 0 ? `${this.props.colorOne}` : `${this.props.colorTwo}`
            })
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
            .attr('height', y.bandwidth())
            .transition()
            .delay(250)
            .duration(500)
            .ease(d3.easeLinear)
            .attr('width', (d) => {
                return x((d[1] - d[0]))
            })
            .transition()
            .delay(13250)
            .ease(d3.easeLinear)
            .attr('width', (d) => {
                return 0;
            })
    }


    render() {
        const styles = {
            colorOne: {
                backgroundColor: `${this.props.colorOne}`
            },
            colorTwo: {
                backgroundColor: `${this.props.colorTwo}`

            }
        }
        return (
            <div className={`${this.props.title} barChart`}>
                <div className='title'>
                    <h1>{this.props.title}</h1>
                    <h2><div className='set' style={styles.colorOne} />{this.props.labelOne}<div className='set' style={styles.colorTwo} />{this.props.labelTwo}</h2>
                </div>
                <div ref='canvas'>
                </div>
            </div>
        )
    }
}

BarChart.propTypes = {
    dataToGraph: PropTypes.array.isRequired,
    title: PropTypes.any
}