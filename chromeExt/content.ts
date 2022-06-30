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

type options = {
  append2021: boolean
}
interface DomObj {
  combobox: HTMLInputElement
  searchBtn: Element | null
  checkbox2021?: HTMLInputElement | null
}
/**
 * iterates over provided array of HTMLElements, changing background color of each element to red.
 * @param {NodeListOf<HTMLElement>} adsArray
 * @returns void
 */

function redifyList(adsArray: NodeListOf<HTMLElement>) {
  console.log(adsArray)
  /*
  
   */
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
  const { appendStatus } = await chrome.storage.sync.get('append2021')
  console.log(appendStatus)
  appendStatus !== (true || false)
    ? chrome.storage.sync.set({ append2021: false })
    : null
  return appendStatus as boolean
}
/**
 *  returns string containing html for checkbox element
 * TODO: examine external state store during next feat and circle back.
 */
function checkboxTemplate(): string {
  return `
  <p>Appending 2021</p>
      `
}

/**
 * Get elements in DOM and add 'change' event listener to combobox
 */
async function setupListeners() {
  const domObj: DomObj = {
    //combobox (google search text input)
    combobox: <HTMLInputElement>document.querySelector('[role="combobox"]'),
    //"Google Search" submit button
    searchBtn: document.querySelector('[aria-label="Google Search"]'),
  }
  console.log(domObj)
  const checkbox = checkboxTemplate()
  const preference = await getAppendPreference()
  //Insert checkbox into DOM to the right of "Google Search" button
  domObj.searchBtn?.insertAdjacentHTML('afterend', checkbox)
  //Get checkbox in DOM
  domObj.checkbox2021 = document.getElementById(
    'checkbox2021'
  ) as HTMLInputElement

  domObj.combobox?.addEventListener('change', () => {
    domObj.combobox?.value &&
    !domObj.combobox.value.includes(' in 2021') &&
    domObj.checkbox2021?.style.display === 'block'
      ? (domObj.combobox.value = domObj.combobox.value + ' in 2021')
      : 0
  })
  /**
   * listen for changes in options
   */
  chrome.storage.onChanged.addListener(async function (
    changes,
    areaName
  ): Promise<void> {
    console.log('storage changed')
    console.log(changes)
    console.log(changes.append2021.newValue)
    //hide checkbox if preference is false
    if (
      changes.append2021.newValue === true &&
      domObj.checkbox2021?.style.display === 'none'
    ) {
      domObj.checkbox2021.style.display = 'block'
    }
    //show checkbox if preference is true
    if (
      changes.append2021.newValue === false &&
      domObj.checkbox2021?.style.display === 'block'
    ) {
      domObj.checkbox2021.style.display = 'none'
    }
  })
}
setupListeners()

export {}
