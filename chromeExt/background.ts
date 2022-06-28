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
        const adsResponse = new Promise<void>((resolve, reject) => {
          message.adsEncountered && message.reason === 'storeAds'
            ? resolve(adMemory(message.adsEncountered))
            : reject('no bueno')
        })
        const appendResponse = new Promise<void>((resolve, reject) => {
          message.msgUrl && message.reason === 'append'
            ? resolve(appendUrl(sender, message.msgUrl, sendResponse))
            : reject('no append')
        })
        return Promise.allSettled([adsResponse, appendResponse]).then(
          (responses) => {
            sendResponse({
              message: {
                adsResponse: responses[0],
                appendResponse: responses[1],
              },
            })
            return {
              adsResponse: responses[0],
              appendResponse: responses[1],
            }
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
 * @param
 *
 * calls updateAds {@link updateAds}, which then conditionally calls either:
 *
 * {@link initAdMemory} (case where there is no AdsEncountered data in storage)
 *
 * OR
 *
 * {@link appendAdMemory} (case: AdsEncountered exists in storage) pushes current entry to end of AdsEncountered array
 *
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
   * @param data
   *  * @example { '1519211810362' : 4 }
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
   * @param data
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
  msgUrl: msg['msgUrl'],
  sendResponse: {
    (response?: any): void
    (arg0: { tab: chrome.tabs.Tab | undefined }): void
  }
) {
  console.log('appendUrl')
  console.log({ sender, msgUrl })
  const outcome = chrome.tabs.update(
    // ID of tab where message originated from / sendMessage was fired
    sender.tab?.id as number,
    //url to navigate to in ^ tab.
    { url: `https://${msgUrl}` },
    //updated tab object with current properties at time of execution
    (tab) => {
      console.log(tab)
      sendResponse({ message: tab })
      return true
    }
  )
  return outcome
}

//FIXME: Type Module didn't appear to work, going to have to examine tsconfig
export {}
