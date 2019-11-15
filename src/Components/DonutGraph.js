import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import './../scss/donut.scss';


export const DonutGraph = ({ dataToGraph, title }) => {
    console.log(dataToGraph)
    var width = 1060,
        height = 1860,
        outerRadius = Math.min(width, height) * .5 - 10,
        innerRadius = outerRadius * .6,
 
        dataLength = null,
        activeData = [],
        queuedData = [];
    const [transitionIn, setTransitionIn ] = useState('true');
    const donutCanvas = React.createRef()
    useEffect(() => {
        dataLength = dataToGraph.length / 2;
        dataToGraph.map((data, i) => {
            return i >= dataLength ? queuedData.push(data.dataSet1) : activeData.push(data.dataSet1);
        })
        activeData.splice(dataLength, activeData.length);
        queuedData.splice(dataLength, queuedData.length);
        phaseDonut();
    }, [])


    useEffect(() => {
        return () => {
            activeData = [];
            queuedData = [];
            transitionIn = true;
        }
    }, [])

    const arcs = (queuedData, activeData) => {
        let pie = d3.pie()
            .sort(null);
        let arcs0 = pie(queuedData),
            arcs1 = pie(activeData),
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

    const phaseDonut = () => {
        let svg = d3.select(donutCanvas.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        svg.selectAll(".arc")
            .data(arcs(queuedData, activeData))
            .enter().append("g")
            .attr("class", "arc")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .append("path")
            .attr("d", d3.arc())
            .attr("class", (d, i) => {
                return dataToGraph[i]['dataSet1'] + i
            })

        //TODO add legend    
        let legendSvg = svg.selectAll(".legend")
            .data(arcs(activeData, queuedData))
            .enter().append("g")
            .attr("transform", (d, i) => {
                return "translate(" + (width - 110) + "," + (i * 15 + 20) + ")";
            })
            .attr("class", "legend")

        legendSvg.append("rect")
            .attr("width", 10)
            .attr("height", 10)
            .attr("class", (d, i) => {
                return dataToGraph[i]['dataSet1'] + i
            })

        legendSvg.append("text")
            .text((d, i) => {
                console.log(d)
                console.log(transitionIn)
                if (transitionIn) {
                    return d.value + " " + dataToGraph[i]['dataSet0'] + " " + dataToGraph[i]['labels']
                } else {
                    return d.next.value + " " + dataToGraph[i + dataLength]['dataSet0'] + " " + dataToGraph[i+dataLength]['labels']
                }
            })
            .style('fill', 'whitesmoke')
            .style("font-size", 12)
            .attr("y", 10)
            .attr("x", 11);
        // //TODO add logos for center of Donut
        transition(transitionIn)
    }

    const transition = (inOrOut) => {
        let path = d3.selectAll(".arc > path")
            .data(inOrOut ? arcs(queuedData, activeData) :
                arcs(activeData, queuedData))
            //Wedges Split into two rings
            .transition()
            .duration(750)
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
        //this could be used as an exit transition with another call to run
        
        if (!transitionIn) {
            clearTimeout();
        } else {
            setTimeout(() => {
               setTransitionIn('false')
            }, 7500);
        }
    }
    return (
        <>
            <h1>{title}</h1>
            <div ref={donutCanvas}></div>
        </>
    )
}

DonutGraph.propTypes = {
    dataToGraph: PropTypes.array.isRequired,
    title: PropTypes.any
}