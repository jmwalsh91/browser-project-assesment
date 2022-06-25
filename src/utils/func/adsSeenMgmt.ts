export interface TaskMemory {
  clearArr: any[]
  count: number
}

/**
 *
 * @param currentTime
 */
export async function storageManagement(
  currentTime: string,
  data: any
): Promise<{ adCount: number }> {
  const { clearArr, count } = getOldAndCountNew(currentTime, data)
  clearArr ? removeOldEntries(clearArr) : null

  const operationInfo = {
    adCount: count,
  }
  return operationInfo
}

function getOldAndCountNew(currentTime: string, data: any): TaskMemory {
  const taskMemory: TaskMemory = {
    clearArr: [],
    count: 0,
  }

  const thisTimeYesterday = parseInt(currentTime) - 86400 * 1000
  for (let i = 0; i < data.length; i++) {
    // get key value pairs to remove
    if (parseInt(data[i][0]) < thisTimeYesterday) {
      taskMemory.clearArr.push(data[i])
    }
    //add quantity of ads @ times which are within the past 24hours
    if (parseInt(data[i]) > thisTimeYesterday) {
      taskMemory.count = taskMemory.count + data[i][1]
    }
  }
  return taskMemory
}

function removeOldEntries(entriesToClear: TaskMemory['clearArr']) {
  chrome.storage.sync.remove(entriesToClear, () => {
    console.log('executed')
  })
}
