export const OmoGames = {
  query: 'http://sticky-data.local:8888/projects-dash/analytics/omo',
  dataHandler: (data) => {
    const omoData = data;
    let omoKeys = Object.keys(omoData)
    let weeklyGames = {}
    let weeklyStories = {}
    let tempObj = {}
    omoKeys.map((c) => {
      let tempStory = 0;
      let tempGame = 0;
      weeklyStories[c + "weeklyStories"] = omoData[c].stories.reduce((acc, curr, ind, src) => {

        tempStory += parseInt(acc.finished);
        curr.weekFinished = tempStory + parseInt(curr.finished);
        if (ind === 1) {
          acc.day = setDayOfWeek(acc.day);
        }
        else if (ind === src.length - 1) {
          acc.day = setDayOfWeek(acc.day);
          curr.day = setDayOfWeek(curr.day);
        }
        else {
          acc.day = setDayOfWeek(acc.day);
        }

        return curr
      })
      weeklyGames[c + "weeklyGames"] = omoData[c].finishedGames.reduce((acc, curr, ind, src) => {
        tempGame += parseInt(acc.finished);
        curr.weekFinished = tempGame + parseInt(curr.finished);
        if (ind === 1) {
          acc.day = setDayOfWeek(acc.day);
        }
        else if (ind === src.length - 1) {
          acc.day = setDayOfWeek(acc.day);
          curr.day = setDayOfWeek(curr.day);
        }
        else {
          acc.day = setDayOfWeek(acc.day);
        }
        return curr
      })
    })

    omoKeys.map((c) => {
      let valueToFetch = omoData[c].finishedGames.length - 1;
      let weekFinished = omoData[c].finishedGames[valueToFetch].weekFinished;
      tempObj[c] = {weekFinished}
    })
    return omoData
  }
}

const setDayOfWeek = (dateStr) => {
  //replace - for / so the actual date is returned
  let today = new Date();
  let newDate = new Date(dateStr.replace(/-/g, '/'));
  return  today.toLocaleDateString('en-US') === newDate.toLocaleDateString('en-US') ? 'Today' : newDate.toLocaleDateString('en-US', { weekday: 'short' });
}
