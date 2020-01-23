export const OmhofKiosks = {
  query: 'http://sticky-data.local:8888/projects-dash/analytics/omhof',
  dataHandler: (data) => {
    const omhofResponse = data;
    //sort by value that exists, then remove special characters from a value with optional param
    let getRelevantData = (outerKey, dataKey, dataValue, kvpToClean = false) => {
      let temp = []
      Object.keys(omhofResponse[outerKey]).forEach((e) => {
        if (omhofResponse[outerKey][e][dataKey] !== dataValue) {
          return
        }
        temp.push(omhofResponse[outerKey][e])
        if (kvpToClean) {
          let awardInfo = _processTitle(omhofResponse[outerKey][e][kvpToClean])
          omhofResponse[outerKey][e][kvpToClean + '-cleaned'] = `${awardInfo['name']} (${awardInfo['year']})`
        }
      })
      return temp
    }
    //combines duplicate objects when filterKey values are the same, then adds together the addition keys as ints, removes the duplicate objs return decsending order
    let combineOmhof = (originalArray, filterKey, additionKey) => {
      let tempArray = [];
      let returnArray = [];
    
      originalArray.map((c) => tempArray.push(Object.values(c)))
      // adds dupes and adds counts
      tempArray.map((c, i) => {
        let indexOfFilter = c.indexOf(originalArray[i][filterKey]);
        let indexOfAdd = c.indexOf(originalArray[i][additionKey]);
        if (Object.is(originalArray[i][filterKey], c[indexOfFilter])) {
          originalArray[i][additionKey] = parseInt(originalArray[i][additionKey]) + parseInt(c[indexOfAdd])
          return returnArray[i] = originalArray[i]
        }
        return returnArray
      })

      const getLogo = (entry) => {
        const keys = ['Artist', 'Album', 'Industry', 'Band']
        const logos = ['artist', 'album', 'hof', 'hof']
        for (let i = 0; i < keys.length; i++) {
          if (entry.indexOf(keys[i]) >= 0 ) {
            return logos[i]
          }
        }
      }
      // Top 5 entries only
      returnArray.length = 5
      return returnArray.map(c => {
        const { 'page_title-cleaned' : title, 'count' : weeklyTotal, 'page_title': logo } = {...c} 
        const logoName = getLogo(logo) || 'hof'
        return Object.assign({}, {title, weeklyTotal, logoName})
        })
    }
    
    let omhof = {
      weekly: getRelevantData('kiosks-7day', "page_path", "/detail", "page_title"),
      daily: getRelevantData('kiosks-today', "page_path", "/detail", "page_title")
    }
    omhof.weekly = combineOmhof(omhof.weekly, 'page_title', 'count');
    omhof.daily = combineOmhof(omhof.daily, 'page_title', 'count');
    
    return omhof
  }
}

function _processTitle(fulltitle) {
  const split= fulltitle.split('-:+:-')

  return {
    year: split[0],
    award: split[1],
    name: _truncateName(split[2]) }
}

function _truncateName (name) {
  const limit = 15
  return name.length > limit ? name.substr(0, limit - 1) + '…' : name
}
