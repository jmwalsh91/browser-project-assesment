/**
 ******************
 * Content Scripts
 ******************
 * /

/**
 * iterates over provided array of HTMLElements, changing background color of each element to red.
 * @param {NodeListOf<HTMLElement>} adsArray
 * @returns void
 */
function redifyList(adsArray: NodeListOf<HTMLElement>) {
  for (let i = 0; i < adsArray.length; i++) {
    adsArray[i].style.backgroundColor = 'red'
  }
}
/**
 * Gets element with where id = 'tads', then selects children div elements with data attribute 'data-text-ad'.
 *
 * If adContainer is truthy, call {@link redifyList} with array of elements as arg.
 *
 * Gets element with classname 'cu-container', if truthy,   call {@link redifyList} with child <a> elements with data attribute 'data-offer-id' as arg.
 * @returns void
 */
function getAds() {
  const adContainer: HTMLElement | null = document.getElementById('tads')
  adContainer &&
    redifyList(
      adContainer.querySelectorAll(
        'div[data-text-ad]'
      ) as NodeListOf<HTMLElement>
    )

  const shoppingAdContainer: HTMLCollection | null =
    document.getElementsByClassName('cu-container')
  shoppingAdContainer &&
    redifyList(
      document.querySelectorAll('a[data-offer-id]') as NodeListOf<HTMLElement>
    )
}
//invoke getAds
getAds()

/**
 * FIXME: Figure out config: TS needs export statement here to circumvent duplicate function implementation err, and chrome does not like the presence of an import or export statement in the compiled script --> current solution is to manually delete the export statement in the dist folder, which is certainly not ideal.
 */

/**
 * *************
 *  APPEND QUERY
 * **************
 */
/*********
 * TYPES:
 *********/
type searchElement = HTMLInputElement
/*************
 * end types
 * ***********
 */
/**
 *  returns string containing html for checkbox element
 * TODO: examine external state store during next feat and circle back.
 */
function checkboxTemplate(): string {
  return `
    <input 
      type="checkbox"
      checked
      id="checkbox2021"
      name="checkbox2021"
      value="in 2021"
      />
      <label for="checkbox2021">
        Search in 2021
        </label>
        `
}

/**
 * getter for combobox (google search bar)
 *
 * inserts {@link checkboxTemplate} into DOM.
 *
 * attaches listener to search button.
 */
function attachClickListenerToBtn() {
  //combobox (google search text input)
  const combobox: searchElement | null = document.querySelector(
    '[aria-label="Search"]'
  )
  //checkbox element to be place in DOM
  const checkbox2021: string = checkboxTemplate()
  //"Google Search" submit button
  const searchBtn = document.querySelector('[aria-label="Google Search"]')
  //Insert checkbox into DOM to the right of "Google Search" button
  searchBtn?.insertAdjacentHTML('afterend', checkbox2021)
  /**
   * Attach click-listener to "Google Search" submit button
   * ONCLICK: if "Combobox" (Google Search text input) contains text, pass value as arg to {@link dispatchURL}.
   * */
  searchBtn?.addEventListener('click', () => {
    combobox?.value ? dispatchURL(combobox.value) : null
  })
}
//attach click listener to submit button
attachClickListenerToBtn()

/**
 * converts provided value to proper query syntax
 * @param val
 * @returns appended URL as string
 */
function urlLiteral(val: string) {
  //concatenate VAL with 'in 2021', convert string to array of "words" seperated by spaces
  const queryWords = `${val} in 2021`.split(' ')
  //convert array back to string with '+' between each word to conform to query syntax, append after query slug
  const urlLiteral = `google.com/search?q=${queryWords.join('+')}`
  //return url as string literal
  return urlLiteral
}
/**
 * evaluates and determines whether provided value (url string) will be dispatched to worker.
 * @param val if val is not null | undefined, and does not already include 'in 2021'
 * call {@link urlLiteral} with val as arg, update msgToDispatch obj,
 * pass msg object to {@link chrome.runtime.sendMessage} to communicate with 'background' worker
 *
 * @returns Promise<void>
 */
async function dispatchURL(val: string) {
  const msgToDispatch = {
    msgUrl: '',
  }
  //check if val exists, and ensure val does not already include 'in 2021'
  if (val && !val.includes('in 2021')) {
    msgToDispatch.msgUrl = urlLiteral(val)
    //dispatch message to worker, block function execution until response is defined.
    chrome.runtime.sendMessage(msgToDispatch, (response) => {
      console.log(response)
      return true
    })
  }
}

export {}
