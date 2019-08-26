import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';



var width = window.innerWidth,
    height = window.innerHeight;

var redTranslate = "translate(600, 200)";

if(width < 800) {
  redTranslate = "translate(200, 600)";
}


export default class Transitions extends Component {
    
    componentDidMount(){
       this.makeGraph(this.props.dataToGraph);
    }

    makeGraph(dataset) {
        const svgCanvas = d3.select(this.refs.canvas)
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        function doIt(dataset) {
        let vis = d3.select("svg");
        const PI = Math.PI;
        const arcMin = 75;
        const arcWidth = 15;
        const arcPad = 1;

        let drawArc = d3.arc()
        .innerRadius((d,i) => {
            return arcMin + i*(arcWidth) + arcPad;
        })
        .outerRadius((d,i) => {
            return arcMin + (i+1)*(arcWidth);
        })
        .startAngle(0 * (PI/180))
        .endAngle((d,i) => {
            return Math.floor((d*6 * (PI/180))*1000)/1000;
        });
        let arcs = vis.selectAll("path.arc-path").data(dataset);
        function arc2Tween(d, index) {
            let interpolate = d3.interpolate(this._current, d);
            this._current = d;
            return (t) => {
                let tmp = interpolate(t);
                return drawArc(tmp, index);
            }
        };
        arcs.transition()
        .duration(300)
        .attr("fill", (d) => {
            let red = Math.floor((1 - d/60)*255);
            return "rgb("+ red +", 51, 51)";
        })
        .attrTween("d", arc2Tween);

        arcs.enter().append("svg:path")
        .attr("class", "arc-path")
        .attr("transform", redTranslate)
        .attr("fill", (d) => {
            let red = Math.floor((1 - d/60)* 255);
            return "rgb("+ red +", 51, 51)";
        })
        .attr("d", drawArc)
        .each((d) => {
            d._current = d;
        });
        }
       doIt(dataset)

    };

    render() {
        return (
            <div ref="canvas">
            </div>
        )
    }
}

Transitions.propTypes = {
    dataToGraph: PropTypes.array.isRequired
}
