/**
 * array of values to clear, # of ads encountered in 24hrs
 * @property clearArr : array of values to clear
 * @property count : # of ads encountered in 24hrs
 */
export interface TaskMemory {
  clearArr: any[]
  count: number
}

/**
 * Gets object conforming to {@link TaskMemory} interface from {@link getOldAndCountNew} {array of values to clear, # of ads encountered in 24hrs}
 *
 * If there are old entries in array of values to clear, pass array as argument to {@link removeOldEntries}
 * @param currentTime time since epoch
 * @param data
 * @returns adCount {number}
 */
export async function storageManagement(
  currentTime: number,
  data: any
): Promise<{ adCount: number }> {
  console.log(currentTime, data)

  //Get array of values to clear, count of ads encountered within 24hrs
  const { clearArr, count } = getOldAndCountNew(
    currentTime,
    data.adsEncountered
  )
  //If there are old entries in array of values to clear, pass array as argument to removeOldEntries
  clearArr ? removeOldEntries(clearArr) : null

  return { adCount: count }
}
/**
 * Find all entries stored more than 24hr ago and return them as an array alongside the count of entries that did not meet that condition
 * @param currentTime time since epoch
 * @param data  {@link AdsEncounteredArray}
 * @returns taskMemory {clearArr: any[], count: number}
 */
function getOldAndCountNew(currentTime: number, data: any): TaskMemory {
  const taskMemory: TaskMemory = {
    clearArr: [],
    count: 0,
  }
  if (data.length !== undefined) {
    //Get time (since epoch) 24 hours ago (in ms)
    const thisTimeYesterday = currentTime - 86400 * 1000
    //iterate through entries
    for (let i = 0; i < data.length; i++) {
      // get key value pairs to remove
      if (data[i][0] < thisTimeYesterday) {
        console.log(data[i][0] + ' is less than ' + thisTimeYesterday)
        //store entries in an array, to be removed later
        taskMemory.clearArr.push(data[i])
      }
      //add quantity of ads @ times which are within the past 24hours
      if (data[i][0] > thisTimeYesterday) {
        console.log(data[i][0] + ' is more than ' + thisTimeYesterday)
        //add quantify of ads encountered @ time to count
        taskMemory.count = taskMemory.count + data[i][1]
      }
    }
  }
  return taskMemory
}

function removeOldEntries(entriesToClear: TaskMemory['clearArr']) {
  chrome.storage.sync.remove(entriesToClear, () => {
    console.log('executed')
  })
}
