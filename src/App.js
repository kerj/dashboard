import React from 'react';
import D3Test from './Components/D3Test'
import './App.css';
import BarChart from './Components/BarChart';
import * as d3 from 'd3';

function App() {
  d3.select("body")
  .transition()
  .delay(1250)
  .style("background-color", "slategrey")

  return (
    <div>
      <D3Test/>
    </div>
  );
}

export default App;
