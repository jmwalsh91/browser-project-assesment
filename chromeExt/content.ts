/**
 ******************
 * Content Script
 ******************
 **/
/**
 * ************
 * INTERFACES
 * ************
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

type options = {
  append2021: boolean
}
/**
 * @interface DomObj
 */
interface DomObj {
  combobox: HTMLInputElement
  searchBtn: Element | null
  indicator2021?: HTMLInputElement | null
}
/**
 * *********************************
 * GET EXTERNAL STATE,
 * DOM OBJECTS, SETUP LISTENERS
 * *********************************
 */
const domObj: DomObj = {
  //combobox (google search text input)
  combobox: <HTMLInputElement>document.querySelector('[role="combobox"]'),
  //"Google Search" submit button
  searchBtn: document.querySelector('[aria-label="Google Search"]'),
}

/**
 * iterates over provided array of HTMLElements, changing background color of each element to red.
 * @param {NodeListOf<HTMLElement>} adsArray
 * @returns void
 */
function redifyList(adsArray: NodeListOf<HTMLElement>) {
  console.log(adsArray)
  let count = 0
  /*
  TODO: docs
   */
  for (let i = 0; i < adsArray.length; i++) {
    adsArray[i].style.backgroundColor = 'red'
    count++
  }
  //Verify if ads were encountered
  count > 0
    ? //Dispatch message
      chrome.runtime.sendMessage(<msg>{
        reason: 'storeAds',
        adsEncountered: <AdsEncounteredMSG>{
          time: Date.now(),
          quantity: count,
        },
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
      //try div >
      document.querySelectorAll(
        'div > a[data-offer-id]'
      ) as NodeListOf<HTMLElement>
    )
}
//invoke getAds
getAds()

/**
 * *************
 *  APPEND QUERY
 * **************
 */
/**
 * Get user preference for appending 'in 2021' to search query.
 *
 * sets 'append2021' to false if it does not exist in storage.
 * @returns appendStatus
 */
async function getAppendPreference(): Promise<boolean> {
  const { append2021 } = await chrome.storage.sync.get('append2021')
  console.log(append2021)
  append2021 !== (true || false)
    ? chrome.storage.sync.set({ append2021: false })
    : null
  return append2021 as boolean
}
let appendPreference = getAppendPreference()
/**
 * @function indicatorTemplate
 * Replace with IIFE?
 * @returns template literal containing html for indicator element
 * 
 */
async function indicatorTemplate(): Promise<string> {
  const indicatorDisplay = (await appendPreference) ? 'flex' : 'none'
  return `
    <div
      aria-label="in 2021"
      aria-description="appends search with 'in 2021'. can change setting in extension popup"  
      style="
      position: absolute;
      right: 0;
      top: 0;
      transform: translate(50%, -50%);
      display: ${indicatorDisplay};
      align-items: center;
      justify-content: center;
      background-color: #0079D3;
      padding: 0;
      border-radius: 12%;
      height: 2rem;
      ">
        <p style="
        padding-y: 0;
        padding-x: 0.25rem;
        ">
          +in2021
        </p>
    </div>
        `
}

/**
 * Get elements in DOM and add 'change' event listener to combobox
 */
async function setupListeners() {
  console.log(domObj)
  const indicator = indicatorTemplate()
  //Insert indicator into DOM to the right of "Google Search" button
  domObj.searchBtn?.insertAdjacentHTML('afterend', await indicator)
  //Get indicator in DOM
  domObj.indicator2021 = document.getElementById(
    'indicator2021'
  ) as HTMLInputElement

  domObj.combobox?.addEventListener('change', async () => {
    !domObj.combobox.value.includes(' in 2021') &&
    (await appendPreference) === true
      ? (domObj.combobox.value = domObj.combobox.value + ' in 2021')
      : ''
  })
}
setupListeners()

/**
 * listen for changes in options
 */
function optionsListener() {
  chrome.storage.onChanged.addListener(async function (changes, areaName) {
    console.log('storage changed', changes, areaName)
    if (domObj.indicator2021) {
      if (changes.append2021) {
        appendPreference = changes.append2021.newValue
        domObj.indicator2021.style.display = (await appendPreference)
          ? 'flex'
          : 'none'
      }
    }
  })
}
optionsListener()
