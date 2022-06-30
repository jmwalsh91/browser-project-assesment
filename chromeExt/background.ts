/**
 * *****************
 * BACKGROUND WORKER
 * *****************
 **/
/* enum Reason {
  'storeAds',
  'append'
} */
/**
 * *******************
 * INTERFACES & TYPES
 * *******************
 */

/**
 * @interface msg
 * message from content script, contains reason and adsEncountered
 */
interface msg {
  reason: 'storeAds' | 'append'
  adsEncountered?: AdsEncounteredMSG
  msgUrl?: string
}
/* interface AdsMSGData {
  adsEncountered: AdsEncounteredMSG
} */

/**
 * @interface AdsEncounteredMSG
 * time of encounter, # of ads encountered
 */
interface AdsEncounteredMSG {
  time: number
  quantity: number
}
/**
 * 2D array
 * @example [[time, qt], [time, qt]]
 */
type AdsEncounteredArray = [
  AdsEncounteredMSG['time'],
  AdsEncounteredMSG['quantity']
][]

/**
 * @function msgListener
 * Listener for messages from content script
 * @returns adsResponse
 */
function msgListener() {
  return chrome.runtime.onMessage.addListener(
    async (
      message: msg,
      sender: chrome.runtime.MessageSender,
      sendResponse
    ) => {
      console.log('msgListener')
      /**
       * {@link adsResponse}: if message.reason is 'storeAds' and message.adsEncountered, resolve promise with the result of executing {@link adMemory}
       */
      const adsResponse = await new Promise<void>((resolve, reject) => {
        message.adsEncountered && message.reason === 'storeAds'
          ? resolve(adMemory(message.adsEncountered))
          : reject('no bueno')
      })
      return adsResponse
    }
  )
}

msgListener()
/**
 * ***********************
 * STORE ADS ENCOUNTERED
 * ***********************
 * */

/*****
 *@function adMemory
 * * adMemory calls {@link updateAds} which gets adsEncountered from storage --> if data, {@link appendAdMemory} else {@link initAdMemory}
 *
 * @param {time} time ads were encountered
 * @param {quantity} quantity of ads encountered  @interface AdsEncounteredMSG
 *
 * @returns {Promise<boolean>}
 */
const adMemory = function ({ time, quantity }: AdsEncounteredMSG) {
  /**
   * @function updateAds
   * gets adsInStorage and conditionally updates storage
   * @interface {@link adsEncounteredMsg}
   * @param {time} time ads were encountered
   * @param {quantity} quantity of ads encountered
   */
  async function updateAds(
    time: AdsEncounteredMSG['time'],
    quantity: AdsEncounteredMSG['quantity']
  ) {
    /**
     * get adsEncountered from storage: if there are entries, append to array, else init array with first entry in correct shape/format
     */
    const adsInStorage = await chrome.storage.sync.get('adsEncountered')
    const adsEncounteredArray = adsInStorage.adsEncountered
    adsEncounteredArray && adsEncounteredArray.length > 0
      ? appendAdMemory(
          adsEncounteredArray as AdsEncounteredArray,
          time,
          quantity
        )
      : initAdMemory(time, quantity)
  }
  /**
   * @function initAdMemory
   * initializes adMemory in db
   * @param {time} time ads were encountered
   * @param {quantity} quantity of ads encountered
   * @example { '1519211810362' : 4 }
   */
  function initAdMemory(
    time: AdsEncounteredMSG['time'],
    quantity: AdsEncounteredMSG['quantity']
  ) {
    chrome.storage.sync.set({ adsEncountered: [[time, quantity]] })
    return true
  }
  /**
   * @function appendAdMemory
   * appends array of adsData
   * @param {adsEncounteredArray} adsEncounteredArray array of arrays containing values corresponding to [time, quantity].
   *
   * @param {time} time ads were encountered
   * @param {quantity} quantity of ads encountered
   */
  function appendAdMemory(
    adsEncounteredArray: AdsEncounteredArray,
    time: AdsEncounteredMSG['time'],
    quantity: AdsEncounteredMSG['quantity']
  ) {
    adsEncounteredArray.push([time, quantity])
    chrome.storage.sync.set({ adsEncountered: adsEncounteredArray })
    console.log(adsEncounteredArray)
    return adsEncounteredArray
  }
  return updateAds(time, quantity)
}
