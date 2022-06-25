/**
 * *****************
 * BACKGROUND WORKER
 * *****************
 **/

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
          if (tab) {
            console.log('success', tab)
            //send response with updated tab object
            sendResponse({ tab: tab })
            return true
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
