export const OmoGraphData = {
  query: 'http://sticky-data.local:8888/projects-dash/analytics/omo',
  dataHandler: (data) => {
    for (const prop in data) {
      prepOmo(data[`${prop}`], prop)
    }
    return data
  },
  omoBarChart: (data) => {
    return data.map((c) => {
      const { finished: dataSet1, started: dataSet0 = 0, day: labels } = { ...c }
      const propToPass = Object.assign({}, { dataSet0, dataSet1, labels });
      return propToPass;
    })
  },
  weeklyCompleted: (data, type) => {
    return Object.keys(data).map((c) => {
      const weeklyTotal = data[c][type].reduce((acc, curr) => {
        let gameName = c
        curr.highProp = acc.dataSet1 ? (parseInt(acc.dataSet1) + parseInt(curr.finished)) : curr.finished
        const { highProp: dataSet1 = 0, name: dataSet0 = gameName, name: labels = gameName } = { ...curr }
        let tempProp = Object.assign({}, { dataSet0, dataSet1, labels });
        return tempProp
      })
      return weeklyTotal
    })
  }
}

const prepOmo = (keys, name) => {
  const omoPrep = { name }
  omoPrep.games = keys.finishedGames.forEach((c) => (c.day = setDayOfWeek(c.day)))
  omoPrep.stories = keys.stories.forEach((c) => (c.day = setDayOfWeek(c.day)))
  return omoPrep
}

const setDayOfWeek = (dateStr) => {
  //replace - for / so the actual date is returned
  let today = new Date();
  let newDate = new Date(dateStr.replace(/-/g, '/'));
  return today.toLocaleDateString('en-US') === newDate.toLocaleDateString('en-US') ? 'Today' : newDate.toLocaleDateString('en-US', { weekday: 'short' });
}