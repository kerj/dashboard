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
                return `${d.dataSet0} degrees celsius on ${d.labels}`
            })
            .style("color", "slategrey")
            .attr("class", (d) => {
                if (d > 79) {
                    return "higherTempurature"
                } else { return "lowerTempurature" }
            })
            .transition()
            .delay(1000)
            .duration(1000)
            .style("color", "black")
    }

    render() {
        return (
            <div ref="list">
                
            </div>
        )
    }
}

EmojiList.propTypes = {

}