import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import './../scss/donut.scss';

var width = 1060,
    height = 1860,
    outerRadius = Math.min(width, height) * .5 - 10,
    innerRadius = outerRadius * .6,
    transitionIn = true,
    activeData = [],
    queuedData = [];

export default class DonutGraph extends Component {

    componentDidMount() {
        this.props.dataToGraph.map((data1) => {
            queuedData.push(0);
            return activeData.push(data1.dataSet0);
        });
        activeData.splice(6, activeData.length);
        queuedData.splice(6, queuedData.length);
        this.phaseDonut();
    }

    componentWillUnmount() {
        activeData = [];
        queuedData = [];
        transitionIn = true;
    }

    arcs(queuedData, activeData) {
        let pie = d3.pie()
            .sort(null);
        let arcs0 = pie(queuedData),
            arcs1 = pie(activeData),
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
            }//update queuedData
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
        let svg = d3.select(this.refs.donutCanvas)
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        svg.selectAll(".arc")
            .data(this.arcs(queuedData, activeData))
            .enter().append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .append("path")
            .attr("d", d3.arc())
            .attr("class", (d,i) => {
                return this.props.dataToGraph[i]['dataSet1'] + i
            })
            
        //TODO add legend    
        let legendSvg = svg.selectAll(".legend")
            .data(this.arcs(activeData, queuedData))
            .enter().append("g")
            .attr("transform", (d, i) => {
                return "translate(" + (width - 110) + "," + (i * 15 + 20) + ")";
            })
            .attr("class", "legend")

        legendSvg.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("class", (d,i) => {
                return this.props.dataToGraph[i]['dataSet1'] + i
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

    transition(inOrOut) {
        let path = d3.selectAll(".arc > path")
            .data(inOrOut ? this.arcs(queuedData, activeData) :
                this.arcs(activeData, queuedData))
            //Wedges Split into two rings
            .transition()
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
        if (!transitionIn) {
            clearTimeout();
        } else {
            transitionIn = false;
            setTimeout(() => {
                this.transition(transitionIn)
            }, 12200);
        }
    }

    render() {
        return (
            <>
                <h1>{this.props.title}</h1>
                <div ref="donutCanvas"></div>
            </>
        )
    }
}

DonutGraph.propTypes = {
    dataToGraph: PropTypes.array.isRequired,
    title: PropTypes.any
}