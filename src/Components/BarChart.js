import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3';
import './../scss/barChart.scss'

export const BarChart = ({ 
  dataToGraph = [], 
  title = '', 
  labelOne = '', 
  labelTwo = '', 
  colorOne = '', 
  colorTwo = '' }) => {
  const canvas = useRef();
  const margin = { top: 350, right: 200, bottom: 355, left: 200 }
  const width = 1060 - margin.left - margin.right
  const height = 1900 - margin.top - margin.bottom
  const styles = {
    colorOne: {
      backgroundColor: `${colorOne}`
    },
    colorTwo: {
      backgroundColor: `${colorTwo}`
    }
  }

  const svgCanvas = d3.select(canvas.current)
    .append("svg")
    .attr("class", title)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    //moves whole canvas
    .attr('transform', 'translate(0,10)')
    .append('g')
    //moves info inside of canvas
    .attr('transform', 'translate(338, 385)')
  //get the data to stack bars keys need to become variable

  const stack = d3.stack()
    .keys(['dataSet0', 'dataSet1'])
    .offset(d3.stackOffsetNone)(dataToGraph)

  const g = d3.select('g')
    .selectAll('g')
    .attr("class", title)
    .data(stack)
    .enter()
    .append('g');

  const x = d3.scaleLinear()
    .rangeRound([0, width - 20])
    .domain([0, d3.max(stack, (d) => {
      if (title === "NEW VS. RETURNING VISITORS") {
        return d3.max(d, (d) => d[1])
      } else {
        return d3.max(d, (d) => d[0])
      }
    })])

  const y = d3.scaleBand()
    .rangeRound([height, 0])
    .padding([.55])
    .domain(dataToGraph.map((d) => {
      return d.labels
    }))

  const drawBarchart = () => {
    svgCanvas.append('g')
      .attr('class', 'x axis')
      .attr("transform", "translate(0, 1217)")
      .style('font-family', 'Montserrat')
      .style('font-weight', 'bold')
      .style('font-size', 48)
      .style('letter-spacing', 2)
      .style("color", "whitesmoke")
      .call(d3.axisBottom(x)
        .ticks(3)
        .tickSize([0]))
      .select('path.domain').remove()

    //y axis
    svgCanvas.append('g')
      .attr('class', 'y axis')
      .attr("transform", "translate(-60, 0)")
      .style('font-family', 'Montserrat')
      .style('font-weight', 'bold')
      .style('font-size', 48)
      .style('letter-spacing', 0)
      .style("color", "whitesmoke")
      .call(d3.axisLeft(y)
        .tickSize([0]))
      .select('path.domain').remove()
      .select('text')

    g.selectAll('rect')
      .data((d) => {
        return d;
      })
      .enter().append('rect')
      .style('fill', (d) => {
        //when starting data at zero, colorOne
        return d[0] === 0 ? `${colorOne}` : `${colorTwo}`
      })
      .attr('x', (d, i) => {
        if (title === "NEW VS. RETURNING VISITORS") {
          return x(d[0])
        } else {
          return x(d)
        }
      })
      .attr('y', (d) => {
        return y(d.data.labels)
      })
      .attr('height', y.bandwidth())
      .transition()
      .delay(250)
      .duration(500)
      .ease(d3.easeCubicIn)
      .attr('width', (d) => {
        return x((d[1] - d[0]))
      })
      .transition()
      .delay(13250)
      .ease(d3.easeCubicOut)
      .attr('width', (d) => {
        return 0;
      })
  }

  useEffect(() => {
    drawBarchart();
  }, [dataToGraph])

  return (
    <>
      <div className={`${title} barChart`}>
        <div className='title'>
          <h1>{title}</h1>
          <h2><div className='set' style={styles.colorOne} />{labelOne}<div className='set' style={styles.colorTwo} />{labelTwo}</h2>
        </div>
        <div ref={canvas}>
        </div>
      </div>
    </>
  )
}
