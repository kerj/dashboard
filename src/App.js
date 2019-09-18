import React from 'react';
import D3Test from './Components/D3Test'
import './App.scss';
import * as d3 from 'd3';

function App() {
  d3.select("body")
  .style("background-color", "rebeccapurple")
  .transition()
  .delay(1500)
  .duration(3000)
  .style("background-color", "darkblue")
  .transition()
  .delay(1500)
  .duration(3000)
  .style("background-color", "forestgreen")
  .transition()
  .delay(1500)
  .duration(3000)
  .style("background-color", "slategrey")
  .transition()
  .delay(1500)
  .duration(3000)
  .style("background-color", "black")

  return (
    <div>
      <D3Test/>
    </div>
  );
}

export default App;
