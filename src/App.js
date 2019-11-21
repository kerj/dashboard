import React from 'react';
import './App.scss';
import * as d3 from 'd3';
import HooksFetchData from './Components/HooksFetchData';

function App() {
  d3.select("body")
    // .style("background-color", "rebeccapurple")
    // .transition()
    // .delay(1500)
    // .duration(3000)
    // .style("background-color", "darkblue")
    // .transition()
    // .delay(1500)
    // .duration(3000)
    // .style("background-color", "forestgreen")
    // .transition()
    // .delay(1500)
    // .duration(3000)
    // .style("background-color", "slategrey")
    // .transition()
    // .delay(1500)
    // .duration(3000)
    .style("background-color", "black")

  return (
    <>
      <HooksFetchData />
    </>
  );
}

export default App;
