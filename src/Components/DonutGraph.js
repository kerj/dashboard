import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import './../scss/donut.scss';


export const DonutGraph = ({ dataToGraph, title }) => {
    var width = 1060,
        height = 1600,
        outerRadius = Math.min(width, height) * .5 - 10,
        innerRadius = outerRadius * .6,
        dataLength = null;

    const transitionIn = useRef(true);
    const donutCanvas = useRef();
    const legend = useRef();
    const activeData = useRef([]);
    const queuedData = useRef([]);

    //TODO: add entry fold-out/exit fold-up
    // const start = useRef(true);


    useEffect(() => {
        dataLength = dataToGraph.length / 2;
        dataToGraph.map((data, i) => {
            if (transitionIn.current) {
                return i >= dataLength ? queuedData.current.push(data.dataSet1) : activeData.current.push(data.dataSet1);
            }
            return null;
        })
        activeData.current.splice(dataLength, activeData.current.length);
        queuedData.current.splice(dataLength, queuedData.current.length);
       
        if (transitionIn.current) {
            setLegendDisplay();
            phaseDonut();
            setTimeout(() => {

                transition();
                setLegendDisplay();
            }, 6500)
        }
        if (!transitionIn.current) {
            d3.select('svg.false').remove()
        }
    }, [transitionIn.current])


    const setLegendDisplay = () => {
        d3.select('svg').remove()
        let svg = d3.select(legend.current)
            .append('svg')
            .attr('width', '450')
            .attr("transform", (d, i) => {
                return "translate(" + ((width / 2) - 150) + "," + (i * 15 + (height / 2) - 60) + ")";
            })
        svg.selectAll(".legend")
            .data(arcs(activeData.current, queuedData.current))
            .enter().append("g")
            .attr("transform", (d, i) => {
                return "translate(" + (20) + "," + (i * 35) + ")";
            })
            .attr("class", (d, i) => {
                if (transitionIn.current) {
                    return dataToGraph[i]['labels'];
                } else {
                    return dataToGraph[i + dataLength]['labels'];
                }
            })
            .append("rect")
            .attr("width", 30)
            .attr("height", 30)

        svg.selectAll("svg")
            .data(arcs(activeData.current, queuedData.current))
            .enter().append('g')
            .attr("class", (d, i) => {
                if (transitionIn.current) {
                    return dataToGraph[i]['labels'];
                } else {
                    return dataToGraph[i + dataLength]['labels'];
                }
            })
            .attr("transform", (d, i) => {
                return "translate(" + (10) + "," + (i * 35) + ")";
            })
            .append("text")
            .text((d, i) => {
                if (transitionIn.current) {
                    return d.value + " " + dataToGraph[i]['dataSet0'] + " " + dataToGraph[i]['labels'];
                } else {
                    return d.value + ' ' + dataToGraph[i + dataLength]['dataSet0'] + ' ' + dataToGraph[i + dataLength]['labels']
                }
            })
            .style('fill', 'whitesmoke')
            .style("font-size", 30)
            .attr("y", 30)
            .attr("x", 45)
    }

    const arcs = (dataStart, dataEnd) => {
        let pie = d3.pie()
            .sort(null);
        let arcs0 = transitionIn.current ? pie(dataStart) : pie(dataEnd),
            arcs1 = transitionIn.current ? pie(dataEnd) : pie(dataStart),
            i = -1,
            currentArc;
        while (++i < dataLength) {
            currentArc = arcs0[i];
            currentArc.innerRadius = innerRadius;
            currentArc.outerRadius = outerRadius;
            currentArc.next = arcs1[i];
        }
        return arcs0
    }

    const tweenArc = (b) => {
        return (a, i) => {
            let d = b.call(this, a, i)
            let interp = d3.interpolateObject(a, d);
            for (let k in d) {
                a[k] = d[k];
            }//update queuedData.current
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

    const phaseDonut = () => {
        let svg = d3.select(donutCanvas.current)
            .append("svg")
            .attr('class', (d, i) => {
                return transitionIn.current
            })
            .attr("width", width)
            .attr("height", height)

        svg.selectAll(".arc")
            .data(arcs(queuedData.current, activeData.current))
            .enter().append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + ((width / 2) + 10 ) + "," + (height - 300) / 2 + ")")
            .append("path")
            .attr("d", d3.arc())
            .attr("class", (d, i) => {
                if (transitionIn.current) {
                    return dataToGraph[i]['labels'];
                } else {
                    return dataToGraph[i + dataLength]['labels'];
                }
            })
        // //TODO add logos for center of Donut
    }

    const transition = (inOrOut) => {
        let path = d3.selectAll(".arc > path")
            .data(inOrOut ? arcs(queuedData.current, activeData.current) :
                arcs(activeData.current, queuedData.current))
            //Wedges Split into two rings
            .transition()
            .duration(500)
            .attrTween("d", tweenArc((d, i) => {
                return {
                    innerRadius: i & 1 ? innerRadius : (innerRadius + outerRadius) / 2,
                    outerRadius: i & 1 ? (innerRadius + outerRadius) / 2 : outerRadius
                };
            }))
            //wedges to be centered on final position
            .transition()
            .attrTween("d", tweenArc((d, i) => {
                let a0 = d.next.startAngle + d.next.endAngle,
                    a1 = d.startAngle - d.endAngle;
                return {
                    startAngle: (a0 + a1) / 2,
                    endAngle: (a0 - a1) / 2
                };
            }))
            //wedges then update values, change size
            .transition()
            .attrTween("d", tweenArc((d, i) => {
                return {
                    startAngle: d.next.startAngle,
                    endAngle: d.next.endAngle
                };
            }))
            //wedges reunite into a single ring
            .transition()
            .attrTween("d", tweenArc((d, i) => {
                return {
                    innerRadius: innerRadius,
                    outerRadius: outerRadius
                }
            }))
    }
    if (!transitionIn.current) {
        clearTimeout();
    } else {
        setTimeout(() => {
            transitionIn.current = false;
        }, 6500);
    }
    return (
        <>
            <h1>{title}</h1>
            <div ref={legend}></div>
            <div ref={donutCanvas}></div>
        </>
    )
}

DonutGraph.propTypes = {
    dataToGraph: PropTypes.array.isRequired,
    title: PropTypes.any
}