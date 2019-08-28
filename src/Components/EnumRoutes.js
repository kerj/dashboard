import React from 'react';
import BarChart from './BarChart';
import DonutGraph from './DonutGraph';
import PropTypes from 'prop-types';

const getGraphForData = (dataProp) => ({
    bar: <BarChart dataToGraph={dataProp} />,
    donut: <DonutGraph dataToGraph={dataProp} />
})

export default function EnumRoutes({state, text}) {
    return (
        <div>
            {getGraphForData(text)[state]}
        </div>
    )
}

EnumRoutes.propTypes = {
    dataProp: PropTypes.array.isRequired,
}