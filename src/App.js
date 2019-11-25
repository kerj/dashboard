import React, {useState, useEffect} from 'react';
import './App.scss';
import * as d3 from 'd3';
import useFetchData from './Components/useFetchData';
import RouteManager from './Components/RouteManager'

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

  const [{ data, isLoading }, doFetch] = useFetchData();

  // All of this state management is about only showing "Loading..." one time the entire time the app runs...
  const [firstLoadFinished, setFirstLoadFinished] = useState(false)
  const [firstLoadStarted, setFirstLoadStarted] = useState(false)
  useEffect(() => {
    // We only care about displaying the first initial load, with visual feedback.
    if (isLoading && !firstLoadStarted) {
      setFirstLoadStarted(true)
    }
  }, [isLoading, firstLoadStarted])
  useEffect(() => {
    if (firstLoadStarted && !isLoading) {
      setFirstLoadFinished(true)
    }
  }, [firstLoadStarted, isLoading])

  return (
    <>
      {
        firstLoadFinished ? <RouteManager stateHelper={data} />: <h1>Loading. . .</h1>
      }
    </>
  )
}

export default App;
