export const OmhofKiosks = {
  query: 'http://sticky-data.local:8888/projects-dash/analytics/omhof',
  dataHandler: (data) => {
    const omhofResponse = data;
    //{outerKey:dataKey:[{someKey: dataValue, kvpToClean: *^*@FOO@@},{..}], outerKey:dataKey:[{},{}]}
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
    //takes array of objects and looks for kvp's that are duplicated and removes from the top
    let combineDuplicates = (arrayOfObjs, duplicateCheck) => {
      let returnArray = [];
      let objectCheck = {};

      for (let object in arrayOfObjs) {
        objectCheck[arrayOfObjs[object][duplicateCheck]] = arrayOfObjs[object];
      }
      for (let object in objectCheck) {
        returnArray.push(objectCheck[object]);
      }
      return returnArray;
    }
    //combines duplicate objects when filterKey values are the same, then adds together the addition keys as ints, removes the duplicate objs return decsending order
    let combineOmhof = (originalArray, filterKey, additionKey) => {
      let tempArray = [];
      let returnArray = [];

      originalArray.map((c) => {
        return tempArray.push(Object.values(c))
      })
      tempArray.map((c, i) => {
        let indexOfFilter = c.indexOf(originalArray[i][filterKey]);
        let indexOfAdd = c.indexOf(originalArray[i][additionKey]);
        if (Object.is(originalArray[i][filterKey], c[indexOfFilter])) {
          originalArray[i][additionKey] = parseInt(originalArray[i][additionKey]) + parseInt(c[indexOfAdd])
          return returnArray[i] = originalArray[i]
        }
        return returnArray
      })
      //reverse order
      returnArray.sort((a, b) => (a[additionKey] < b[additionKey]) ? -1 : ((a[additionKey] > b[additionKey]) ? 1 : 0));
      //remove duplicates
      returnArray = combineDuplicates(returnArray, filterKey)
      //return ascending order
      returnArray.sort((a, b) => (b[additionKey] < a[additionKey]) ? -1 : ((a[additionKey] > b[additionKey]) ? 1 : 0));
      //change page_path field to type of award for scss class
      returnArray.map((c) => {
        return c['page_title'].includes('Artist') ? c['page_path'] = 'artist' :
          c['page_title'].includes('Album') ? c['page_path'] = 'album' :
            c['page_title'].includes('Industry') ? c['page_path'] = 'hof' :
              c['page_title'].includes('Band') ? c['page_path'] = 'artist' : c['page_path'] = 'hof'
      })
      return returnArray
    }

    let omhof = {
      weekly: getRelevantData('kiosks-7day', "page_path", "/detail", "page_title"),
      daily: getRelevantData('kiosks-today', "page_path", "/detail", "page_title")
    }
    omhof.weekly = combineOmhof(omhof.weekly, 'page_title', 'count');
    omhof.daily = combineOmhof(omhof.daily, 'page_title', 'count');

    omhof.weekly.length = 5;
    omhof.daily.length = 5;

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
