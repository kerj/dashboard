// no data coming from endpoint, response comes back with object having empty properties 3/5/2020
// export const Timbers = {
//   query: 'http://sticky-data.local:8888/projects-dash/?project=timbers',
//   dataHandler: (data) => {
//     let allKeys = Object.keys(data);
//     let cleanData = allKeys.map((c) => {
//       let timberData = {}
//       let currentRows = data[`${c}`].rows;
//       let currentCols = data[`${c}`].cols;
//       currentCols.forEach((curr, i) => {
//         timberData[curr] = [];
//         for (let j = 0; j <= currentRows.length - 1; j++) {
//           timberData[curr].push(currentRows[j][i]);
//         }
//         if (currentRows.length === 0) {
//           timberData[curr].push("none")
//         }
//         return timberData
//       })
//       return timberData
//     })

//     return timberData(cleanData)
//   }
// }

// const timberData = (cleanData) => {
//   let finalTimberData = {}
//   let timberDataObj = {}
//   let timberData = [];

//   cleanData.forEach((c, i) => {
//     const currentKeys = Object.keys(c);
//     let objsToMake = cleanData[i][currentKeys[0]].length;
//     for (let k = 0; k < objsToMake; k++) {
//       let timberDataObj = {};
//       currentKeys.forEach((curr) => {
//         if (curr === 'ga:userType' && c[curr][k] === 'New Visitor') {
//           timberDataObj.new = c[curr][k];
//           timberDataObj.return = null;
//         } else if (curr === 'ga:userType' && c[curr][k] === 'Returning Visitor') {
//           timberDataObj.new = null;
//           timberDataObj.return = c[curr][k];
//         } else if (curr === 'ga:operatingSystem' && c[curr][k] === 'iOS') {
//           timberDataObj.iOS = c[curr][k]
//           timberDataObj.android = null;
//         } else if (curr === 'ga:operatingSystem' && c[curr][k] === 'Android') {
//           timberDataObj.iOS = null;
//           timberDataObj.android = c[curr][k];
//         } else
//         if (curr === 'ga:sessions' && timberDataObj.new != null) {
//           timberDataObj.new = c[curr][k]
//         } else if (curr === 'ga:sessions' && timberDataObj.new === null) {
//           timberDataObj.return = c[curr][k]
//         }
//         //adds i for cases where names are the same
//         timberDataObj[curr + i] = c[curr][k]
//       })
//       timberData.push(timberDataObj);
//     }
//     return timberData
//   })
//   //issue with response-users-newusers inconsistant response length where a day can be cut off
//   //problem when no new, or returning visisors have used this
//   if (cleanData[0]['ga:userType'].length === 14) {
//     timberDataObj.user = timberData.slice(0, 14)
//     timberDataObj.top5Emoji = timberData.slice(14, 19)
//     timberDataObj.mostPopEmoji = timberData.slice(19, 20)
//     timberDataObj.operatingSystem = timberData.slice(20)
//   } else if (cleanData[0]['ga:userType'].length === 13) {
//     timberDataObj.user = timberData.slice(0, 13)
//     timberDataObj.top5Emoji = timberData.slice(13, 18)
//     timberDataObj.mostPopEmoji = timberData.slice(18, 19)
//     timberDataObj.operatingSystem = timberData.slice(19)
//   } else if (cleanData[0]['ga:userType'].length === 12) {
//     timberDataObj.user = timberData.slice(0, 12)
//     timberDataObj.top5Emoji = timberData.slice(12, 17)
//     timberDataObj.mostPopEmoji = timberData.slice(17, 18)
//     timberDataObj.operatingSystem = timberData.slice(18)
//   }
//   finalTimberData.timberData = timberDataObj
//   return finalTimberData;
// }
