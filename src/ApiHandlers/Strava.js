import { stravaAuth } from './auth/index'

export const getStravaRides = {
  proxy: "https://testthisout.herokuapp.com/",
  query: "https://www.strava.com/api/v3/athlete/activities",
  queryParams :
  {
    crossdomain: true,
    method: 'get',
    params: {
        'before': '1564555884',
        'after': '1438325484',
        'page': '1',
        'per_page': '30',
    },
    headers: {
        'Authorization': `Bearer  + ${stravaAuth}`,
        'accept': 'application/json'
    },
  },
  dataHandler: (data) => {
    let stravaGraph = [];
    const stravaData = data[0].data;
      stravaData.map((c) => {
        const miles = convertToMiles(c.distance)
        const feet = convertToFeet(c.total_elevation_gain)
        const date = c.start_date;
        const propToPass = {
          dataSet0: miles,
          dataSet1: feet,
          labels: date
        }
        return stravaGraph.push(propToPass)
    })
    stravaGraph.sort((a, b) => b.dataSet0 - a.dataSet0)
    stravaGraph.length = 7;
    return stravaGraph;
  }
}

const convertToMiles = (distance) => {
  const rideDistance = distance
  return parseInt(rideDistance)/1609;
}

const convertToFeet = (distance) => {
  const climbDistance = distance
  return parseInt(climbDistance)/1609*40;
}

const convertToDate = (date) => {
  const shortDate = { date }

}

// start_date
// date, rideDistance, climbDistance