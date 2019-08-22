import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';


export default class DonutGraph extends Component {

    componentDidMount() {
      this.drawDonutChart(this.props.dataToGraph)
    }
    
    drawDonutChart(data) {
        //boiler plate canvas
        var margin = { top: 40, right: 20, bottom: 40, left: 40 }
        var canvasWidth = 400 - margin.left - margin.right
        var canvasHeight = 600 - margin.top - margin.bottom
        var radius = Math.min(canvasWidth, canvasHeight) /2;

        const svgCanvas = d3.select(this.refs.canvas)
            .append("svg")
            .attr("width", canvasWidth + margin.left + margin.right)
            .attr("height", canvasHeight + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + canvasWidth / 2 + ',' + canvasHeight / 2 + ')')

        let color = d3.scaleOrdinal()
        .range(["#00D7D2', '#FF4436', '#313c53"])

        let pie = d3.pie()
            .sort(null)
            .value((d) => {
                return d.fahrenheitMinTemp;
            })
        let path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 70);

        let label = d3.arc()
            .outerRadius(radius - 40)
            .innerRadius(radius - 40);
        
        let arc = svgCanvas.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");
        
            arc.append("path")
                .attr("d", path)
                .attr("fill", (d) => {
                    console.log(d);
                    
                    return color(d.data.date);
                });

            arc.append("text")
                .attr("transform", (d) => {
                    return "translate(" + label.centroid(d) + ")";
                })
                .attr("dy", "0.35em")
                .text((d) => {
                    return d.data.date;
                })
        


     

    }

    render() {
        return (
            <div ref="canvas">
                
            </div>
        )
    }
}

DonutGraph.propTypes = {
    dataToGraph: PropTypes.array.isRequired
}
