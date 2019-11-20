import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './../scss/emojiList.scss';

export default class EmojiList extends Component {

    componentDidMount() {
        this.displayList(this.props.dataToGraph);
    }

    displayList(data) {
        const item = d3.select(this.refs.list)
            .selectAll("div")
            .data(data)
            .enter()
            .append("p")
            .attr("class", (d) => {
                return this.props.dataToGraph.length === 1 ? `${d.dataSet0} solo item` : `${d.dataSet0} item`
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
                return this.props.dataToGraph.length === 1 ? `${d.dataSet0} reveal solo item` : `${d.dataSet0} reveal item`
            })
            .transition()
            .delay((d, i) => {
                return i * 100 + 99999999
            })
            .attr('class', (d) => {
                return this.props.dataToGraph.length === 1 ? `${d.dataSet0} solo item` : `${d.dataSet0} item`
            })
    }

    render() {
        return (
            <div className={'emoji-list'}>
                <h1>{this.props.title}</h1>
                <div ref="list">
                </div>
            </div>
        )
    }
}

EmojiList.propTypes = {
    dataToGraph: PropTypes.array.isRequired,
    title: PropTypes.any
}

