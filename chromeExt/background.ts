console.log('script ran')
/**
 * shared types
 */
enum Reason {
  ToggleClick,
  Submit,
}
/**
 * listener
 * @param {@link contentMessage}
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const outcome = message.msgUrl
    ? chrome.tabs.update(
        sender.tab?.id as number,
        { url: `https://${message.msgUrl}` },
        (tab) => {
          if (tab) {
            console.log('success', tab)
            sendResponse({ tab: tab })
            return true
          }
          if (!tab) {
            console.log('error', tab)
            sendResponse({ error: chrome.runtime.lastError })
          }
        }
      )
    : null
  return true
})
export {}
