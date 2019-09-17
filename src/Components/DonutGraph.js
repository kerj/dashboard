import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';

var width = 960,
    height = 500,
    outerRadius = Math.min(width, height) * .5 - 10,
    innerRadius = outerRadius * .6,
    transitionIn = true,
    data0 = [],
    data = [];

export default class DonutGraph extends Component {

    componentDidMount() {
        this.props.dataToGraph.map((data1) => {
            data.push(0);
            return data0.push(data1.dataSet0);
        });
        data0.splice(6, data0.length);
        data.splice(6, data.length);
        this.phaseDonut();
    }

    componentWillUnmount() {
        data0 = [];
        data = [];
        clearTimeout();
    }

    arcs(data, data0) {
        let pie = d3.pie()
            .sort(null);
        let arcs0 = pie(data),
            arcs1 = pie(data0),
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

    tweenArc(b) {
        return (a, i) => {
            let d = b.call(this, a, i)
            let interp = d3.interpolateObject(a, d);
            for (let k in d) {
                a[k] = d[k];
            }//update data
            return (t) => {
                let tempProps = interp(t);
                let arc = d3.arc()
                if (tempProps.innerRadius) {
                    return arc({
                        innerRadius: tempProps.innerRadius,
                        outerRadius: tempProps.outerRadius,
                        startAngle: a.startAngle,
                        endAngle: a.endAngle,
                    })
                } else {
                    return arc({
                        innerRadius: a.innerRadius,
                        outerRadius: a.outerRadius,
                        startAngle: tempProps.startAngle,
                        endAngle: tempProps.endAngle,
                    })
                }
            };
        }
    }

    phaseDonut() {
        let colors = ['#bc2add', '#FF4436', '#4bdd2a', '#e77f18', '#1880E7', '#1de2ca', '#E21H35', '#E23I86', '#fg77R2', '#3Wg487'];
        let svg = d3.select(this.refs.donutCanvas)
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        svg.selectAll(".arc")
            .data(this.arcs(data, data0))
            .enter().append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .append("path")
            .attr("fill", (d, i) => {
                return colors[i];
            })
            .attr("d", d3.arc())

        //TODO add legend    
        let legendSvg = svg.selectAll(".legend")
            .data(this.arcs(data0, data))
            .enter().append("g")
            .attr("transform", (d, i) => {
                return "translate(" + (width - 110) + "," + (i * 15 + 20) + ")";
            })
            .attr("class", "legend")

        legendSvg.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("fill", (d, i) => {
                return colors[i]
            })

        legendSvg.append("text")
            .text((d, i) => {
                if (transitionIn) {
                    return d.value + " " + this.props.dataToGraph[i]['dataSet1'] + " " + this.props.dataToGraph[i]['labels']
                } else {
                    return d.next.value
                }
            })
            .style('fill', 'whitesmoke')
            .style("font-size", 12)
            .attr("y", 10)
            .attr("x", 11);
        // //TODO add logos for center of Donut
        this.transition(transitionIn)
    }


    transition(transitionIn) {
        let path = d3.selectAll(".arc > path")
            .data(transitionIn ? this.arcs(data, data0) : this.arcs(data0, data));
        //Wedges Split into two rings
        let t0 =
            path.transition()
                .duration(750)
                .attrTween("d", this.tweenArc((d, i) => {
                    return {
                        innerRadius: i & 1 ? innerRadius : (innerRadius + outerRadius) / 2,
                        outerRadius: i & 1 ? (innerRadius + outerRadius) / 2 : outerRadius
                    };
                }))
                //wedges to be centered on final position
                .transition()
                .attrTween("d", this.tweenArc((d, i) => {
                    let a0 = d.next.startAngle + d.next.endAngle,
                        a1 = d.startAngle - d.endAngle;
                    return {
                        startAngle: (a0 + a1) / 2,
                        endAngle: (a0 - a1) / 2
                    };
                }))
                //wedges then update values, change size
                .transition()
                .attrTween("d", this.tweenArc((d, i) => {
                    return {
                        startAngle: d.next.startAngle,
                        endAngle: d.next.endAngle
                    };
                }))
                //wedges reunite into a single ring
                .transition()
                .attrTween("d", this.tweenArc((d, i) => {
                    return {
                        innerRadius: innerRadius,
                        outerRadius: outerRadius
                    }
                }))
        //this could be used as an exit transition with another call to run
    }
    //tweenArc can be called twice in a row and cause the animation to look choppy initially - this doesnt always happen


    render() {
        setTimeout(() => {
            this.transition(!transitionIn)
        }, 12200);

        return (
            <div ref="donutCanvas">
            </div>
        )
    }
}

DonutGraph.propTypes = {
    dataToGraph: PropTypes.array.isRequired
}