import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function RouteManager(props) {
    let dataToCycle = Object.keys(props.stateHelper).slice(3);
    let routesAvailable = props.stateHelper[`${dataToCycle[this.props.dataKey]}`].routes;
    
    //routes change every 15 seconds
    useInterval(() => {
        updateRoute();
    }, 5000)

    function useInterval(callback, delay) {
        const savedCallback = useRef();
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay])
    }
    
    return (
            this.props.func(route)
    )
}

RouteManager.propTypes = {
    stateHelper: PropTypes.object.isRequired,
    func: PropTypes.func.isRequired
}