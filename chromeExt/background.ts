/**
 * *****************
 * BACKGROUND WORKER
 * *****************
 **/
/**
 * Broker/Router
 */
chrome.runtime.onMessage.addListener((message) => {
  message.reason === 'storeAds' ? adMemory(message.adsEncountered) : null
})
interface AdsMSGData {
  adsEncountered: AdsEncounteredMSG
}
interface AdsEncounteredMSG {
  time: number
  quantity: number
}
type AdsEncounteredArray = [
  AdsEncounteredMSG['time'],
  AdsEncounteredMSG['quantity']
][]

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
  async function update(
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
    return console.log(adsInStorage)
  }

  return update(time, quantity)
}
/**
 *listen for onMessage event
 **/
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // if message.msgUrl is not null or undefined, update URL in tab where sendMessage originated
  const outcome = message.msgUrl
    ? chrome.tabs.update(
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
    : //Do nothing.
      null
  //Return true to appease the Promise Gods, apparently.
  return true
})

//FIXME: Type Module didn't appear to work, going to have to examine tsconfig
export {}
