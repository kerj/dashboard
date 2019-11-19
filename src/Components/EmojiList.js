import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './../scss/emojiList.scss';

export default class EmojiList extends Component {

    componentDidMount() {
        this.displayList(this.props.dataToGraph);
    }

    displayList(data) {
        d3.select(this.refs.list)
            .selectAll("div")
            .data(data)
            .enter()
            .append("p")
            .attr("class", (d) => {
                return this.props.dataToGraph.length === 1 ? `${d.dataSet0} solo` : `${d.dataSet0}`
            })
            .text((d) => {
                return `${d.labels}: ${d.dataSet1}`
            })
            .transition()
            .delay((d, i) => {
                return i * 600 + 100
            })
            .attr('class', (d) => {
                return this.props.dataToGraph.length === 1 ? `${d.dataSet0} reveal solo` : `${d.dataSet0} reveal`
            })
            .transition()
            .delay((d, i) => {
                return i * 100 + 12300
            })
            .attr('class', (d) => {
                return this.props.dataToGraph.length === 1 ? `${d.dataSet0} solo` : `${d.dataSet0}`
            })
    }

    render() {
        return (
            <>
                <h1>{this.props.title}</h1>
                <div ref="list">
                </div>
            </>
        )
    }
}

EmojiList.propTypes = {
    dataToGraph: PropTypes.array.isRequired,
    title: PropTypes.any
}