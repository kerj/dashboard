import React, { Component } from 'react';
import PropTypes from 'prop-types';
import emojiList from './../CSS/emojiList.css'
import * as d3 from 'd3';

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
            .text((d) => {
                //d.dataSet0 should be an Image!!
                return `${d.dataSet0} ${d.dataSet1} ${d.labels}`
            })
            .style("color", "black")
            .transition()
            .delay(500)
            .duration(1000)
            .style("color", "red")
    }

    render() {
        return (
            <div ref="list">
            </div>
        )
    }
}

EmojiList.propTypes = {
    dataToGraph: PropTypes.array.isRequired,
}