import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './../scss/emojiList.scss';

export default class EmojiList extends Component {

    componentDidMount() {
        this.displayList(this.props.dataToGraph);
    }

    displayList(data) {
        //this shows as text what is displayed in the barchart
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
                return `${d.dataSet1} - ${d.labels}`
            })
            .attr("class", (d) => {
                return `${d.labels}`
            })
            .style("font-size", "24px")
            .style("color", "whitesmoke")
            .style("font-family", "Impact, Charcoal, sans-serif")
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