import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

export default class EmojiList extends Component {

    componentDidMount() {
        this.displayList(this.props.dataToGraph)
    }

    displayList(data) {
        //this shows as text what is displayed in the barchart
        d3.select(this.refs.list)
            .selectAll("li")
            .data(data)
            .enter()
            .append("li")
            .text((d) => {
                return `${d.dataSet0} reads or emojis ${d.labels}`
            })
            .style("color", "whitesmoke")
            .attr("class", (d) => {
                if (d > 79) {
                    return "higherTempurature"
                } else { return "lowerTempurature" }
            })
            .transition()
            .delay(2000)
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