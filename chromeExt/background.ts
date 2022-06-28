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
 * message from content script
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
 * Response typing for sendResponse
 */
type responseObj = { message: string }

/**
 * Listener
 */
function msgListener() {
  return chrome.runtime.onMessage.addListener(
    //Params
    async (message: msg, sender: chrome.runtime.MessageSender, sendResponse) =>
      //callback
      {
        console.log('msgListener')
        /**
         * {@link adsResponse}: if message.reason is 'storeAds' and message.adsEncountered, resolve promise with the result of executing {@link adMemory}.
         *
         */
        const adsResponse = new Promise<void>((resolve, reject) => {
          message.adsEncountered && message.reason === 'storeAds'
            ? resolve(adMemory(message.adsEncountered))
            : reject('no bueno')
        })
        const appendResponse = new Promise<void>((resolve, reject) => {
          message.msgUrl && message.reason === 'append'
            ? resolve(appendUrl(sender, message.msgUrl))
            : reject('no append')
        })
        return Promise.allSettled([adsResponse, appendResponse]).then(
          (responses) => {
            return Promise.resolve(
              sendResponse({
                adsResponse: responses[0],
                appendResponse: responses[1],
              })
            )
          }
        )
      }
  )
}

msgListener()
/**
 * ***********************
 * STORE ADS ENCOUNTERED
 * *******
 * */

/*****
 * adMemory
 * * adMemory calls {@link updateAds} which gets adsEncountered from storage --> if data, {@link appendAdMemory} else {@link initAdMemory}
 * @param {time} time ads were encountered
 * @param {quantity} quantity of ads encountered
 *
 * @returns Promise<boolean>
 */

const adMemory = function ({ time, quantity }: AdsEncounteredMSG) {
  /**
   * gets adsInStorage and conditionally updates storage
   * @param data
   */
  async function updateAds(
    time: AdsEncounteredMSG['time'],
    quantity: AdsEncounteredMSG['quantity']
  ) {
    const adsInStorage = await chrome.storage.sync.get('adsEncountered') //[time, quantity]
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
   * initializes adMemory in db
   * @param {time} time ads were encountered
   * @param {quantity} quantity of ads encountered
   * @example { '1519211810362' : 4 }
   */
  function initAdMemory(
    time: AdsEncounteredMSG['time'],
    quantity: AdsEncounteredMSG['quantity']
  ) {
    chrome.storage.sync.set({ adsEncountered: [time, quantity] })
    return true
  }
  /**
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
    return adsEncounteredArray
  }
  return updateAds(time, quantity)
}

async function appendUrl(
  sender: chrome.runtime.MessageSender,
  msgUrl: msg['msgUrl']
) {
  console.log('appendUrl')
  console.log({ sender, msgUrl })
  //Get tab that sendMessage was called from. Will sendMessage with results of executing the following promises.
  const [currTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  })
  const outcome = chrome.tabs.update(
    // ID of tab where message originated from / sendMessage was fired
    currTab.id as number,
    //url to navigate to in ^ tab.
    { url: `https://${msgUrl}` },
    //updated tab object with current properties at time of execution
    (tab) => {
      console.log(tab)
      return { tab: tab }
    }
  )
  return Promise.resolve(outcome)
}

//FIXME: Type Module didn't appear to work, going to have to examine tsconfig
export {}
