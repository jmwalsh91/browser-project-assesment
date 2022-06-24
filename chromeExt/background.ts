console.log('script ran')
chrome.runtime.onMessage.addListener(function (message) {
  switch (message.newVal) {
    case true: 
      message.append ? appendQuery(message.newVal) : null //update 
    break;
    case false:
      return
  }
  return true 
})

chrome.runtime.onMessage.addListener(function (message) {
  const queryStr = message.newVal
  message.newVal.toLowerCase().includes('in 2021')
    ? null
    : appendQuery(queryStr)
})
function appendQuery(queryString: string) {
  console.log()
  
  chrome.declarativeNetRequest.updateDynamicRules(
    {
      removeRuleIds: [0, 1, 2, 3, 4, 5, 6],
      addRules: [
        {
          id: 0,
          priority: 1,
          condition: {
            urlFilter: '*://www.google.com/*',
          },
          action: {
            //Needed to directly provide enum member as value in type
            type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
            redirect: {
              transform: {
                queryTransform: {
                  addOrReplaceParams: [
                    { key: 'q', value: `${queryString} in 2021` },
                  ],
                },
              },
            },
          },
        },
      ],
    },
    () => {
      console.log(chrome.runtime.lastError)
      console.log(chrome.declarativeNetRequest.getMatchedRules())
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [5, 6],
      })
    }
  )
  /* const qInfo = {
    text: queryString + ' in 2021',
  }
  chrome.search.query(qInfo, function () {
    console.log(qInfo.text)
  }) */
}
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(() => {
  console.log('match')
})
export {}
