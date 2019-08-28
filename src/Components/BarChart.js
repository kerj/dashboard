import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

//Issues still with getting both bars to start at x = 0, this is needed for transitions in/out

export default class BarChart extends Component {

    componentDidMount() {
        if(this.checkBarType(this.props.dataToGraph, 'dataSet1') === 0) {
             this.drawBarChart(this.props.dataToGraph)
        }else {
            this.drawBarChart(this.props.dataToGraph)
        }
    }

    componentDidUpdate() {
        // this.drawBarChart(this.props.dataToGraph)
    }

    //adds all prop of the data together 
    checkBarType(data, prop){
      return data.reduce((a,b) => {
          return b[prop] == 0 ? a : a + b[prop];
      }, 0);
    };


    drawBarChart(data) {
        var margin = { top: 40, right: 20, bottom: 40, left: 40 }
        var canvasWidth = 400 - margin.left - margin.right
        var canvasHeight = 600 - margin.top - margin.bottom

        //container for graph
        const svgCanvas = d3.select(this.refs.barCanvas)
            .append("svg")
            .attr("class", "barchart")
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
            <div ref="barCanvas">
            </div>
        )
    }
}

BarChart.propTypes = {
    dataToGraph: PropTypes.array.isRequired,

}

// x and y for vertical charts

// let x = d3.scaleBand()
//     .rangeRound([0, canvasWidth - 20])
//     .padding(0.1)
//     .domain(data.map((d) => {
//         return d.date
//     }))

// let y = d3.scaleLinear()
//     .range([canvasHeight, 0])
//     .domain([0, d3.max(stack, (d) => {
//         return d3.max(d, (d) => d[1])
//     })])

// x, y, width, height to replace under .ease method inside of g.selectAll

    // .attr('x', (d, i) => {
    //     return x(d.data.date)
    // })
    // .attr('y', (d) => {
    // return y(d[1])
    //     })
    // .attr('width', x.bandwidth())
    // .attr('height', (d) => {
    // return y(d[0]) - y(d[1]);
    //     }) 