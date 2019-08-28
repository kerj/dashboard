import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

var width = 960,
    height = 500,
    outerRadius = Math.min(width, height) * .5 - 10,
    innerRadius = outerRadius * .6,
    displayMax = true,
    data0 = [],
    data1 = [];

export default class DonutGraph extends Component {

    componentDidMount() {
        this.props.dataToGraph.map((data) => {
            data0.push(data.fahrenheitMaxTemp);
            data1.push(data.fahrenheitMinTemp);
        });
        // this.drawDonutChart(this.props.dataToGraph)
        this.phaseDonut()
    }

    componentWillUnmount() {
        //empty data for next render
        data0.length = 0
        data1.length = 0
    }

    arcs(currentData, nextData) {
        let pie = d3.pie()
            .sort(null);
        let arcs0 = pie(currentData),
            arcs1 = pie(nextData),
            i = -1,
            currentArc;
        while (++i < 6) {
            currentArc = arcs0[i];
            currentArc.innerRadius = innerRadius;
            currentArc.outerRadius = outerRadius;
            currentArc.next = arcs1[i];
        }
        return arcs0
    }

    phaseDonut() {
        let colors = ['#bc2add', '#FF4436', '#4bdd2a', '#e77f18', '#1880E7', '#1de2ca', '#E21H35'];

        let svg = d3.select(this.refs.donutCanvas)
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        svg.selectAll(".arc")
            .data(this.arcs(data0, data1))
            .enter().append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .append("path")
            .attr("fill", (d, i) => {
                return colors[i];
            })
            .attr("d", d3.arc());

        svg.selectAll(".legend")
            .data()
    }
    //
    tweenArc(b) {
        return (a, i) => {
            let d = b.call(this, a, i)
            let interp = d3.interpolateObject(a, d);
            for (let k in d) {
                a[k] = d[k];
                // console.log(a[k], k)
            }//update data
            return (t) => {
                //if k is an angle do this, else k is a radius do that
                //tempProps is angles || radi properties dependent on the t# that called it 
                let tempProps = interp(t);
                let arc = d3.arc()
                if (tempProps.innerRadius) {
                    return arc({
                        innerRadius: tempProps.innerRadius,
                        outerRadius: tempProps.outerRadius,
                        startAngle: a.startAngle,
                        endAngle: a.endAngle
                    })
                } else {
                    return arc({
                        innerRadius: a.innerRadius,
                        outerRadius: a.outerRadius,
                        startAngle: tempProps.startAngle,
                        endAngle: tempProps.endAngle
                    })
                }
            };
        }
    }

    transition(displayMax) {
        let path = d3.selectAll(".arc > path")
            .data(displayMax ? this.arcs(data0, data1) : this.arcs(data1, data0));
            console.log(displayMax);
            
        //Wedges Split into two rings
        let t0 =
            path.transition()
                .duration(500)
                .attrTween("d", this.tweenArc((d, i) => {
                    return {
                        innerRadius: i & 1 ? innerRadius : (innerRadius + outerRadius) / 2,
                        outerRadius: i & 1 ? (innerRadius + outerRadius) / 2 : outerRadius
                    };
                }));
        //wedges to be centered on final position
        let t1 =
            t0.transition()
                .attrTween("d", this.tweenArc((d, i) => {
                    let a0 = d.next.startAngle + d.next.endAngle,
                        a1 = d.startAngle - d.endAngle;
                    return {
                        startAngle: (a0 + a1) / 2,
                        endAngle: (a0 - a1) / 2
                    };
                }));
        //wedges then update values, change size
        let t2 =
            t1.transition()
                .attrTween("d", this.tweenArc((d, i) => {
                    return {
                        startAngle: d.next.startAngle,
                        endAngle: d.next.endAngle
                    };
                }));
        //wedges reunite into a single ring
        let t3 =
            t2.transition()
                .attrTween("d", this.tweenArc((d, i) => {
                    return {
                        innerRadius: innerRadius,
                        outerRadius: outerRadius
                    }
                }))
                displayMax = !displayMax;
    }
    render() {
        setTimeout(() => {
            this.transition(displayMax)
        }, 8000);

        return (
            <div ref="donutCanvas">
            </div>
        )
    }
}

DonutGraph.propTypes = {
    dataToGraph: PropTypes.array.isRequired
}

//basic donut
 // drawDonutChart(data) {
    //     //boiler plate canvas
    //     var margin = { top: 40, right: 20, bottom: 40, left: 40 }
    //     var canvasWidth = 400 - margin.left - margin.right
    //     var canvasHeight = 600 - margin.top - margin.bottom
    //     var radius = Math.min(canvasWidth, canvasHeight) / 2;

    //     const svgCanvas = d3.select(this.refs.canvas)
    //         .append("svg")
    //         .attr("width", canvasWidth + margin.left + margin.right)
    //         .attr("height", canvasHeight + margin.top + margin.bottom)
    //         .append('g')
    //         .attr('transform', 'translate(' + canvasWidth / 2 + ',' + canvasHeight / 2 + ')')

    //     let colors = ['#00D7D2', '#FF4436', '#313c53', '#e77f18', '#1880E7', '#1de2ca', '#E21D35'];

    //     let pie = d3.pie()
    //         .sort(null)
    //         .value((d) => {
    //             return d.fahrenheitMinTemp;
    //         })
    //     let path = d3.arc()
    //         .outerRadius(radius - 10)
    //         .innerRadius(radius - 70);

    //     let label = d3.arc()
    //         .outerRadius(radius - 40)
    //         .innerRadius(radius - 40);

    //     let arc = svgCanvas.selectAll(".arc")
    //         .data(pie(data))
    //         .enter().append("g")
    //         .attr("class", "arc");

    //     arc.append("path")
    //         .attr("d", path)
    //         .attr("fill", (d, i) => {
    //             return colors[i];
    //         });

    //     arc.append("text")
    //         .attr("transform", (d) => {
    //             return "translate(" + label.centroid(d) + ")";
    //         })
    //         .attr("dy", "0.35em")
    //         .text((d) => {
    //             return d.data.fahrenheitMinTemp;
    //         })
    // }
