import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './../scss/topList.scss';

//TODO: new OMOAPIHANDLER broke something fix the addition of most popular
export const TopList = ({ dataToGraph = [], title, subtitle }) => {
  const list = useRef()

  useEffect(() => {
    return () => dataToGraph.length = 0
  }, [])
  
  useEffect(() => {
    if (!dataToGraph.length) return
    displayList(dataToGraph)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataToGraph])

  const displayList = (data) => {
    const item = d3.select(list.current)
      .selectAll("div")
      .data(data)
      .enter()
      .append("p")
      .attr("class", (d) => {
        return dataToGraph.length === 1 ? `${d.dataSet0} solo item` : `${d.dataSet0} item`
      })

    item.append('div')
      .attr('class', (d) => `pic`)

    item.append('p')
      .text((d) => {
        return `${d.labels}`
      })
      .attr('class', 'label')
    item.append('h1')
      .text((d) => {
        return `${d.dataSet1}`
      })

    item.transition()
      .delay((d, i) => {
        return i * 600 + 100
      })
      .attr('class', (d) => {
        return dataToGraph.length === 1 ? `${d.dataSet0} reveal solo item` : `${d.dataSet0} reveal item`
      })
      .transition()
      .delay((d, i) => {
        return dataToGraph.length !== 1 ? (13000 - i * 100) - (100 * dataToGraph.length) + i * 100 - 600 : 13600
      })
      .attr('class', (d) => {
        return dataToGraph.length === 1 ? `${d.dataSet0} solo item` : `${d.dataSet0} item`
      })
  }

  return (
    <div className={'top-list'}>
      <div className={'title'}>
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
      </div>
      <div className={'content'}>
        <div ref={list} />
      </div>
    </div>
  )

}

TopList.propTypes = {
  dataToGraph: PropTypes.array.isRequired,
  title: PropTypes.any,
  subtitle: PropTypes.any,
}

