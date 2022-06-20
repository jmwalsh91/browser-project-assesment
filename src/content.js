//content scripts here
console.log('content script ran')

/**
 * iterates over provided array of HTMLElements, changing background color of each element to red.
 * @param {HTMLCollection} adsArray
 */
function redifyList(adsArray) {
  for (i = 0; i < adsArray.length; i++) {
    adsArray[i].style.backgroundColor = 'red'
  }
}
/**
 * gets element with where id = 'tads', then selects children div elements with data attribute 'data-text-ad'
 * if ads is truthy, call {@link redifyList} with array of elements as arg. If falsy, log error
 * TODO: error handling.
 * @returns HTMLCollection of elements matching selector
 */
async function getAds() {
  const adContainer = document.getElementById('tads')
  adContainer && redifyList(adContainer.querySelectorAll('div[data-text-ad]'))

  const shoppingAdContainer = document.getElementsByClassName('cu-container')
  console.log(shoppingAdContainer)
  shoppingAdContainer &&
    redifyList(document.querySelectorAll('a[data-offer-id]'))
}
//invoke get ads
getAds()
