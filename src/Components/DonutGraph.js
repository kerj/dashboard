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

        this.props.dataToGraph.map((day) => {
            data0.push(day.fahrenheitMaxTemp);
            data1.push(day.fahrenheitMinTemp);
        });
        // this.drawDonutChart(this.props.dataToGraph)
        this.phaseDonut(this.props.dataToGraph)
    }

    componentDidUpdate() {
        console.log("it updated!");

        // this.drawDonutChart(this.props.dataToGraph)
    }

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

    // transitionInDonut0(data) {
    //     var margin = { top: 40, right: 20, bottom: 40, left: 40 }
    //     var canvasWidth = 400 - margin.left - margin.right
    //     var canvasHeight = 600 - margin.top - margin.bottom
    //     var radius = Math.min(canvasWidth, canvasHeight) / 2;

    //     const PI = Math.PI;
    //     const arcMin = 75;
    //     const arcWidth = 15;
    //     const arcPad = 1;

    //     let data0 = [];
    //     let data1 = [];
    //     this.props.dataToGraph.map((day) => {
    //         data0.push(day.fahrenheitMaxTemp);
    //         data1.push(day.fahrenheitMinTemp);
    //     });

    //     d3.select(this.refs.canvas)
    //         .append("svg")
    //         .attr("width", canvasWidth)
    //         .attr("height", canvasHeight)

    //     let renderArcs = (data) => {
    //         let vis = d3.select("svg")


    //         let drawArc = d3.arc()
    //             .innerRadius((d, i) => {
    //                 return arcMin + i * (arcWidth) + arcPad;
    //             })
    //             .outerRadius((d, i) => {
    //                 return arcMin + (i + 1) * (arcWidth);
    //             })
    //             .startAngle(0 * (PI / 180))
    //             .endAngle((d, i) => {
    //                 return Math.floor((d * 6(PI / 180)) * 1000) / 1000;
    //             })


    //         var redArcs = vis.selectAll("path.red-path")
    //             .data(data)

    //         let arc2Tween = (d, i) => {
    //             let interp = d3.interpolate(this._current, d)
    //             this._current = d;
    //             return (t) => {
    //                 let temp = interp(t);
    //                 return drawArc(temp, i)
    //             }
    //         };

    //         redArcs.transition()
    //             .duration(300)
    //             .attr("fill", (d) => {
    //                 let red = Math.floor((1 - d / 60) * 255);
    //                 return "rgb(" + red + ", 51, 51)";
    //             })
    //             .attrTween("d", arc2Tween);

    //         redArcs.enter().append("svg:path")
    //             .attr("class", "red-path")
    //             .attr("fill", (d) => {
    //                 let red = Math.floor((1 - d / 60) * 255);
    //                 return "rgb(" + red + ", 51, 51)";
    //             })
    //             .attr("d", drawArc)
    //             .each((d) => {
    //                 this._current = d;
    //             })

    //     }
    //     renderArcs()

    // }



    // arcs(data0, data1) {
    //     data0 = [];
    //     data1 = [];
    //     let pie = d3.pie();

    //     this.props.dataToGraph.map((day) => {
    //         data0.push(day.fahrenheitMaxTemp);
    //         data1.push(day.fahrenheitMinTemp);
    //     });


    //     let arcs0 = pie(data0);
    //     let arcs1 = pie(data1);
    //     let i = -1;
    //     let arc;


    //     while (++i < 5) {
    //         //i need the arc here
    //         console.log(arcs0[i]);

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
            console.log(currentArc);

        }
        console.log(arcs0);

        return arcs0
    }

    phaseDonut(data) {
        let data0 = []
        let data1 = []
        data.map((day) => {
            data0.push(day.fahrenheitMaxTemp);
            data1.push(day.fahrenheitMinTemp);
        });
        // let width = 960,
        //     height = 500,
        //     outerRadius = Math.min(width, height) * .5 - 10,
        //     innerRadius = outerRadius * .6;

        let colors = ['#00D7D2', '#FF4436', '#313c53', '#e77f18', '#1880E7', '#1de2ca', '#E21D35'];

        let svg = d3.select("svg")
            .attr("width", width)
            .attr("height", height);

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
    }
    //
    tweenArc(b) {
        return (a, i) => {
            let d = b.call(this, a, i)
            let interp = d3.interpolateObject(a, d);
            for (let k in d) {
                a[k] = d[k];
            }//update data
            return (t) => {
                //t is a decimal to turn into an arc via interpolate and arc
                let tempval = interp(t);
                let arc = d3.arc()
                console.log(a);
                
                //temp val is an object that has inner and outerRadius values, I want arc to add the start and endAngle.. however it goes to nan,nan,nan
                return arc({
                  innerRadius: tempval.innerRadius,
                  outerRadius: tempval.outerRadius,
                  startAngle: a.startAngle,
                  endAngle: a.endAngle
                })
            };
        }
    }

//     function tweenArc(b) {
//     return function (a, i) {
//         var d = b.call(this, a, i);
//         var i = d3.interpolate(a, d);
//         for (var k in d) {
//             a[k] = d[k]
//         }; // update data
//         return function (t) {
//             return arc(i(t));
//         };
//     };
// }


transition(displayMax, innerRadius, outerRadius) {
    let path = d3.selectAll(".arc > path")
        .data(displayMax ? this.arcs(data0, data1) : this.arcs(data1, data0));

    console.log("path", path);

    //Wedges Split into two rings
    let t0 =
        path.transition()
            .duration(1000)
            .attrTween("d", this.tweenArc((d, i) => {
                console.log("data passed to t0", d);

                return {
                    innerRadius: i & 1 ? innerRadius : (innerRadius + outerRadius) / 2,
                    outerRadius: i & 1 ? (innerRadius + outerRadius) / 2 : outerRadius
                };
            }));

    //wedges to be centered on final position
    let t1 =
        t0.transition()
            .attrTween("d", this.tweenArc((d, i) => {
                console.log(d);

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
                console.log(d);

                return {
                    startAngle: d.next.startAngle,
                    endAngle: d.next.endAngle
                };
            }));

    //wedges reunite into a singel ring
    let t3 =
        t2.transition()
            .attrTween("d", this.tweenArc((d, i) => {
                return {
                    innerRadius: innerRadius,
                    outerRadius: outerRadius
                }
            }))


    setTimeout(() => {
        displayMax = !displayMax
        this.transition(displayMax, innerRadius, outerRadius)
    }, 5000);


}




// g.append("path")
//     .datum({ endAngle: (2 * (Math.PI)) })
//     .style("fill", "#ddd")
//     .attr("d", arc);

// let foreground = g.append("path")
//     .datum({ endAngle: 0.127 * (2 * (Math.PI)) })
//     .style("fill", "orange")
//     .attr("d", arc);

// let arcTween = (newAngle) => {
//     d3.interval(() => {
//         foreground.transition()
//             .duration(1000)
//             .attrTween("d", arcTween(Math.random() * Math.PI));
//     }, 3500)
//     return (d) => {
//         let interpolate = d3.interpolate(d.endAngle, newAngle)
//         return (t) => {
//             d.endAngle = interpolate(t);
//             return arc(d);
//         }
//     }
// }
// arcTween(arc)
// }


render() {
    setTimeout(() => {
        this.transition(displayMax, innerRadius, outerRadius);
    }, 5000)
    return (
        <div ref="canvas">
        </div>
    )
}
}

DonutGraph.propTypes = {
    dataToGraph: PropTypes.array.isRequired
}
