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
            .delay((d, i) => {
                return i * 100 + 100;
            })
            .duration(1000)
            .ease(d3.easeElasticOut)
            .text((d) => {
                return `${d.labels}: ${d.dataSet1}`
            })
            .attr("class", (d) => {
                return `${d.labels}`
            })
            .style("color", "whitesmoke")

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