/**
 * *****************
 * BACKGROUND WORKER
 * *****************
 **/

/**
 * Set object in chrome synced storage with time and window location. Object has shape of {time (string) : length of timeArray}.
 * @param {number[]} timeArray array of time values from Data.now() in {@link redifyList}
 * @example { '1519211810362' : 4 }
 */
function storeAds(timeArray: number[]) {
  chrome.storage.sync.set(
    { timeQuantity: [timeArray[0], timeArray.length] },
    function () {
      console.log(`set ${[timeArray[0], timeArray.length]}`)
    }
  )
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
