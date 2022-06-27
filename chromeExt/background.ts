/**
 * *****************
 * BACKGROUND WORKER
 * *****************
 **/
/* enum Reason {
  'storeAds',
  'append'
} */

interface msg {
  reason: 'storeAds' | 'append'
  adsEncountered?: AdsEncounteredMSG
  msgUrl?: string
}
/* interface AdsMSGData {
  adsEncountered: AdsEncounteredMSG
} */
interface AdsEncounteredMSG {
  time: number
  quantity: number
}
type AdsEncounteredArray = [
  AdsEncounteredMSG['time'],
  AdsEncounteredMSG['quantity']
][]

/**
 * Broker/Router
 */
chrome.runtime.onMessage.addListener(
  (message: msg, sender: chrome.runtime.MessageSender, sendResponse) => {
    switch (message.reason) {
      case 'storeAds':
        message.adsEncountered?.quantity !== (0 || undefined)
          ? adMemory(message.adsEncountered)
          : null
        break
      case 'append':
        //TODO: GATE
        appendUrl(sender, message.msgUrl, sendResponse)
    }
  }
)

//Needs:
//Distinguish between AdsEncountered { time, quantity} from MSG
// and adsEncounteredArray from .get()

const adMemory = function ({ time, quantity }: AdsEncounteredMSG) {
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
    console.log('adsEncountered')
    adsEncounteredArray.push([time, quantity])
    console.log(adsEncounteredArray)
    console.log('after push')
    chrome.storage.sync.set({ adsEncountered: adsEncounteredArray })
  }
  /**
   * gets adsInStorage and conditionally updates storage
   * @param data
   */
  async function updateAds(
    time: AdsEncounteredMSG['time'],
    quantity: AdsEncounteredMSG['quantity']
  ) {
    const adsInStorage = await chrome.storage.sync
      .get('adsEncountered') //[time, quantity]
      .then((data) => {
        const adsEncounteredArray = data.adsEncountered
        adsEncounteredArray && adsEncounteredArray.length > 0
          ? appendAdMemory(
              adsEncounteredArray as AdsEncounteredArray,
              time,
              quantity
            )
          : initAdMemory(time, quantity)
        return adsEncounteredArray
      })
    console.log(adsInStorage)
    return true
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
  chrome.tabs.update(
    // ID of tab where message originated from / sendMessage was fired
    sender.tab?.id as number,
    //url to navigate to in ^ tab.
    { url: `https://${msgUrl}` },
    //updated tab object with current properties at time of execution
    (tab) => {
      sendResponse({ tab: tab })
      sender.tab
        ? chrome.tabs.goForward(sender.tab!.id!, () => {
            return true
          })
        : sendResponse(chrome.runtime.lastError)
    }
  )
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
