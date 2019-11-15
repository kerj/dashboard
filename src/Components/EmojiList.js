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
            .selectAll("li")
            .data(data)
            .enter()
            .append("li")
            .transition()
            .duration(1000)
            .ease(d3.easeElasticOut)
            .text((d) => {
                return `${d.labels}: ${d.dataSet1}`
            })
            .attr("class", (d) => {
                return this.props.dataToGraph.length === 1 ? `${d.dataSet0} solo` : `${d.dataSet0}`
            })
    }

    render() {
        return (
            <>
                <h1>{this.props.title}</h1>
                <ul ref="list">
                </ul>
            </>
        )
    }
}

EmojiList.propTypes = {
    dataToGraph: PropTypes.array.isRequired,
    title: PropTypes.any
}