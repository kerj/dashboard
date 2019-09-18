import React from 'react';
import D3Test from './Components/D3Test'
import './App.scss';
import * as d3 from 'd3';

function App() {
  d3.select("body")
  .transition()
  .delay(1500)
  .style("background-color", "black")

  return (
    <div>
      <D3Test/>
    </div>
  );
}

export default App;
