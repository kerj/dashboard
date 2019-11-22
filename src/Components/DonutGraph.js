import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {useInterval} from '../Hooks/useInterval'
import './../scss/donut.scss';


export const DonutGraph = ({ dataToGraph, title, subtitle }) => {
    var width = 1000,
        height = 1000,
        outerRadius = Math.min(width, height) * .5 - 10,
        innerRadius = outerRadius * .6,
        dataLength = useRef();

    const transitionBetweenSets = useRef(true);
    const donutCanvas = useRef();
    const legend = useRef();
    const activeData = useRef([]);
    const queuedData = useRef([]);
    const dataQueue = useRef([]);
    const arcRef = useRef([[], []]);

    //TODO: add entry fold-out/exit fold-up

    const lastData = useRef(null)
    useEffect(() => {
        // This check shouldn't be necessary, but we've temporarily got some
        // issues of potentially getting passed the same props over and over, making dev hard.
        let isChanged = tempNewDataCheck(lastData.current, dataToGraph)
        if (!isChanged) { return }

        if (lastData.current !== dataToGraph) {
            lastData.current = dataToGraph
        }

        dataLength.current = dataToGraph.length / 2;
        arcRef.current = [
          new Array(dataLength.current).fill(0),
          new Array(dataLength.current).fill(0)
        ]
    }, [dataToGraph])


    useEffect(() => {
        dataLength.current = dataToGraph.length / 2;
        dataToGraph.map((data, i) => {
            if (transitionBetweenSets.current) {
                return i >= dataLength.current ? activeData.current.push(data.dataSet1) : queuedData.current.push(data.dataSet1);
            }
            return null;
        })

        activeData.current.splice(dataLength.current, activeData.current.length);
        queuedData.current.splice(dataLength.current, queuedData.current.length);

        // Pass 1: Enter
        if (currentState === STATES.ENDED) {
            pushOntoArcData(activeData.current)
            phaseDonut();
            transition();
            setLegendDisplay();
            // Logic here
            setCurrentState(STATES.ENTER)
        }

        console.log(activeData.current, queuedData.current)
        if (!transitionBetweenSets.current) {
            d3.select('svg.false').remove()
        }
    }, [transitionBetweenSets])


    const STATES = {
        STARTING: 'st',
        ENTER: 'en',
        NEXT: 'n',
        ENDED: 'ex',
    }
    const [currentState, setCurrentState] = useState(STATES.ENDED)
    useInterval(() => {

        // Pass 2: Display 2nd data (if available)
        if (currentState === STATES.ENTER) {
            if (!queuedData.current || queuedData.current.length > 0) {
                setCurrentState(STATES.NEXT)
                return
            }

            pushOntoArcData(queuedData.current)
            transition();
            setLegendDisplay();
            setCurrentState(STATES.NEXT)
        }

        // Pass 3: Exit Animate
        if (currentState === STATES.NEXT) {
            pushOntoArcData([0,0,0,0])
            transition();
            setLegendDisplay();

            // Logic here
            setCurrentState(STATES.ENDED)
        }
    }, 6500)

    const pushOntoArcData = (data) => {

        console.log('before', arcRef.current.toString())
        console.log('shift', arcRef.current.shift().toString())
        arcRef.current.push(data)
        console.log('after', arcRef.current.toString())
    }

    const setLegendDisplay = () => {
        return
        d3.select('svg').remove()
        let svg = d3.select(legend.current)
            .append('svg')
            .attr('width', 450)
            .attr('height', (d, i) => {
                return dataLength.current * 60
            })
        svg.selectAll(".legend")
            .data(arcs(queuedData.current, activeData.current))
            .enter().append("g")
            .attr("transform", (d, i) => {
                return "translate(" + (20) + "," + ((i * 65) + 3) + ")";
            })
            .attr("class", (d, i) => {
                if (transitionBetweenSets.current) {
                    return dataToGraph[i]['labels'];
                } else {
                    return dataToGraph[i + dataLength.current]['labels'];
                }
            })
            .append("rect")
            .attr("width", 30)
            .attr("height", 30)

        svg.selectAll("svg")
            .data(arcs(arcRef.current[0], arcRef.current[1]))
            .enter().append('g')
            .attr("class", (d, i) => {
                if (transitionBetweenSets.current) {
                    return dataToGraph[i]['labels'];
                } else {
                    return dataToGraph[i + dataLength.current]['labels'];
                }
            })
            .attr("transform", (d, i) => {
                return "translate(" + (10) + "," + (i * 65) + ")";
            })
            .append("text")
            .text((d, i) => {
                if (transitionBetweenSets.current) {
                    return dataToGraph[i]['labels'] + " " + dataToGraph[i]['dataSet0'];
                } else {
                    return dataToGraph[i + dataLength.current]['labels'] + ' ' + dataToGraph[i + dataLength.current]['dataSet0']
                }
            })
            .style('fill', 'whitesmoke')
            .style("font-size", 30)
            .attr("y", 30)
            .attr("x", 45)
    }

    const arcs = (dataStart, dataEnd) => {
        console.warn('arcscall', dataStart, dataEnd)
        let pie = d3.pie()
            .sort(null);
        let arcs0 = pie(dataStart),
            arcs1 = pie(dataEnd),
            i = -1,
            currentArc;
        while (++i < dataLength.current) {
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
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('width', `${width / 2}`)
            .attr('height', `${height / 2}`)
            .attr('class', (d, i) => {
                return 'donut'
            })
        svg.selectAll(".arc")
            .data(arcs(arcRef.current[0], arcRef.current[1]))
            .enter().append("g")
            .attr("class", "arc")
            .attr("transform", "translate(500,500)")
            .append("path")
            .attr("d", d3.arc())
            .attr("class", (d, i) => {
                if (transitionBetweenSets.current) {
                    return dataToGraph[i]['labels'];
                } else {
                    return dataToGraph[i + dataLength.current]['labels'];
                }
            })
        // //TODO add logos for center of Donut
    }

    const transition = (inOrOut) => {
        let path = d3.selectAll(".arc > path")
            .data(arcs(arcRef.current[0], arcRef.current[1]))
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
    if (!transitionBetweenSets.current) {
        clearTimeout();
    } else {
        setTimeout(() => {
            //transitionBetweenSets.current = false;
        }, 6500);
    }
    return (
        <div className='donutChart'>
            <div className='title'>
                <h1>{title}</h1>
                <h2>{subtitle}</h2>
            </div>
            <div className='graph'>
                <div ref={legend} />
                <div ref={donutCanvas} />
            </div>
        </div>
    )
}

function tempNewDataCheck (oldData, newData) {
    // This check shouldn't be necessary, but we've temporarily got some
    // issues of potentially getting passed the same props over and over, making dev hard.
    if (!oldData || oldData.length !== newData.length) return true

    let isChanged = false

    for (let i = 0; i < newData.length; i++) {
        let lastVals = Object.values(oldData[i])
        let newVals = Object.values(newData[i])

        for (let j = 0; j < newVals.length; j++) {
            console.log(newVals[j], lastVals[j])
            isChanged = isChanged && newVals[j] !== lastVals[j]
        }
    }
    return isChanged
}

DonutGraph.propTypes = {
    dataToGraph: PropTypes.array.isRequired,
    title: PropTypes.any,
    subtitle: PropTypes.any
}
