import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';


export default class DonutGraph extends Component {

    componentDidMount() {
        this.drawDonutChart(this.props.dataToGraph)
        // this.transition(1)
    }

    drawDonutChart(data) {
        //boiler plate canvas
        var margin = { top: 40, right: 20, bottom: 40, left: 40 }
        var canvasWidth = 400 - margin.left - margin.right
        var canvasHeight = 600 - margin.top - margin.bottom
        var radius = Math.min(canvasWidth, canvasHeight) / 2;

        const svgCanvas = d3.select(this.refs.canvas)
            .append("svg")
            .attr("width", canvasWidth + margin.left + margin.right)
            .attr("height", canvasHeight + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + canvasWidth / 2 + ',' + canvasHeight / 2 + ')')

        let colors = ['#00D7D2', '#FF4436', '#313c53', '#e77f18', '#1880E7', '#1de2ca', '#E21D35'];

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
            .attr("fill", (d, i) => {
                return colors[i];
            });

        arc.append("text")
            .attr("transform", (d) => {
                return "translate(" + label.centroid(d) + ")";
            })
            .attr("dy", "0.35em")
            .text((d) => {
                return d.data.fahrenheitMinTemp;
            })
    }

    // arcs(data0, data1) {
    //     let arcs0 = d3.pie(this.props.dataToGraph),
    //         arcs1 = d3.pie(this.props.dataToGraph),
    //         i = -1,
    //         arc;
    //     while (++i < 5) {
    //         arc = arcs0[i];
    //         arc.innerRadius = innerRadius;
    //         arc.outRadius = outerRadius;
    //         arc.next = arcs1[i];
    //     }
    //     return arcs0;
    // }

    //  tweenArc(b) {
    //      let arc = d3.arc();
    //     return function(a, i) {
    //       var d = b.call(this, a, i), i = d3.interpolate(a, d);
    //       for (var k in d) a[k] = d[k]; // update data
    //       return function(t) { return arc(i(t)); };
    //     };
    //   }

    // transition(param) {
    //     let path = d3.selectAll(".arc > path")
    //         //what are we transitioning between????
    //         .data(param ? this.arcs(this.props.dataToGraph, this.props.dataToGraph) : this.arcs(this.props.dataToGraph, this.props.dataToGraph));

    //     let transition0 = path.transition()
    //         .duration(1000)
    //         .attrTween("d", this.tweenArc((d,i) => {
    //             return {
    //                 innerRadius: i & 1 ? innerRadius : (innerRadius + outerRadius) / 2,
    //                 outerRadius: i & 1 ? (innerRadius + outerRadius) /2 : outerRadius
    //             };
    //         }));
    //     let transition1 = transition0.transition()
    //         .attrTween("d", this.tweenArc((d,i) =>{
    //             let angle0 = d.next.startAngle + d.next.endAngle,
    //                 angle1 = d.startAngle - d.endAngle;
    //             return {
    //                startAngle: (angle0 + angle1) /2,
    //                endAngle: (angle0 - angle1) /2
    //             };
    //         }));
    //     let transition2 = transition1.transition()
    //         .attrTween("d", this.tweenArc((d,i) => {
    //             return {
    //                 startAngle: d.next.startAngle,
    //                 endAngle: d.next.endAngle
    //             };
    //         }));
    //     let transition3 = transition2.transition()
    //         .attrTween("d", this.tweenArc((d,i) => {
    //             return {
    //                 innerRadius: innerRadius,
    //                 outerRadius: outerRadius
    //             };
    //         }));
    // }

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
