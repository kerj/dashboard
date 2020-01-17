export const OmoGraphData = {
  query: 'http://sticky-data.local:8888/projects-dash/analytics/omo',
  dataHandler: (data) => {
    for (const prop in data) {
      prepOmo(data[`${prop}`], prop)
    }
    return data
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