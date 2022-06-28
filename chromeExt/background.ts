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
 * *******
 * Route msg + Logic
 * ********
 */
/**
 * Promise closure
 *
 */
async function routeMsg(
  message: msg,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void
) {
  switch (message.reason) {
    case 'storeAds':
      console.log('storeAds case')
      message.adsEncountered && message.adsEncountered.quantity > 0
        ? await adMemory(message.adsEncountered, sendResponse)
        : sendResponse({ message: 'No encountered ads provided.' })
      break
    case 'append':
      console.log('append case')
      await appendUrl(sender, message.msgUrl, sendResponse)
      console.log('after append in switch')
      break
    default:
      console.log('default case')
      sendResponse({
        message:
          'This is not the happy path. I do not even know what path we are on',
      })
  }
  console.log('before resolve routemsg')
  return Promise.resolve(true)
}
/**
 * Listener: routes msg data to relevant function
 */
chrome.runtime.onMessage.addListener(
  (message: msg, sender: chrome.runtime.MessageSender, sendResponse) => {
    sendResponse({ message: 'begin' })
    return routeMsg(message, sender, sendResponse)
  }
)

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

const adMemory = function (
  { time, quantity }: AdsEncounteredMSG,
  sendResponse: { (response?: any): void; (arg0: { message: string }): void }
) {
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
    sendResponse({ message: 'ad memory initialized' })
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
    sendResponse({ message: 'ad memory appended' })
    console.log(adsEncounteredArray)
    return true
  }
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

// if message.msgUrl is not null or undefined, update URL in tab where sendMessage originated
/* 
chrome.tabs.update(
  // ID of tab where message originated from / sendMessage was fired
  sender.tab?.id as number,
  //url to navigate to in ^ tab.
  { url: `https://${message.msgUrl}` },
  //updated tab object with current properties at time of execution
  (tab) => {
    if (tab?.status === 'loading') {
      console.log('success', tab)
      //send response with updated tab object
      chrome.webNavigation.onCompleted.addListener(function (details) {
        console.log(tab.status, 'oncompleted')
        sendResponse({ tab: tab })
      })
    }
    if (!tab) {
      console.log('error', tab)
      //send response with error if tab is falsey
      sendResponse({ error: chrome.runtime.lastError })
    }
  }
)
 */
//FIXME: Type Module didn't appear to work, going to have to examine tsconfig
export {}
