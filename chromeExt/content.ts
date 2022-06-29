/**
 ******************
 * Content Scripts
 ******************
 **/
interface msg {
  reason: 'storeAds' | 'append'
  adsEncountered?: AdsEncounteredMSG
  msgUrl?: string
}
interface AdsEncounteredMSG {
  time: number
  quantity: number
}
/**
 * iterates over provided array of HTMLElements, changing background color of each element to red.
 * @param {NodeListOf<HTMLElement>} adsArray
 * @returns void
 */

function redifyList(adsArray: NodeListOf<HTMLElement>) {
  console.log(adsArray)
  //
  /*   interface AdKeyValue {
  Date: number
  url: string
  } */

  /*
  TODO: docs
   */
  const adsToStore: number[] | null = []
  /*
  TODO: docs
   */
  for (let i = 0; i < adsArray.length; i++) {
    adsArray[i].style.backgroundColor = 'red'
    adsToStore.push(Date.now())
  }
  //Verify if ads were encountered
  adsToStore.length > 0
    ? //Dispatch message
      chrome.runtime.sendMessage({
        reason: 'storeAds',
        adsEncountered: { time: Date.now(), quantity: adsToStore.length },
      })
    : null
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
      //TODO: add parent selector
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
function setupListeners() {
  /*  const optionState = { 
    settingAppend: //get user options
} */
  const domObj = {
    //combobox (google search text input)
    combobox: <HTMLInputElement>document.querySelector('[role="combobox"]'),
    //checkbox element to be placed in DOM
    //pass option state for conditional return
    checkbox2021: <string>checkboxTemplate(),
    //"Google Search" submit button
    searchBtn: document.querySelector('[aria-label="Google Search"]'),
  }
  console.log(domObj)
  //Insert checkbox into DOM to the right of "Google Search" button
  domObj.searchBtn?.insertAdjacentHTML('afterend', domObj.checkbox2021)

  domObj.combobox?.addEventListener('change', () => {
    domObj.combobox?.value && !domObj.combobox.value.includes(' in 2021')
      ? (domObj.combobox.value = domObj.combobox.value + ' in 2021')
      : 0
  })
}
setupListeners()

export {}
