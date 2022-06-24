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
interface searchValue {
  [key: string]: HTMLInputElement['value']
}
/*************
 * end types
 * ***********
 */
/**
 * sends message to service worker with value in searchbar.
 * @param {searchValue} searchValue
 */
function dispatchSearchValToWorker(searchValue: searchValue) {
  chrome.runtime.sendMessage(searchValue)
}
/**
 * create and insert checkbox into DOM
 * TODO: examine external state store during next feat and circle back.
 */
function checkboxTemplate() {
  return `
    <input 
      type="checkbox"
      
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
 * getter for search bar textfield / input element.
 *
 * attaches listener to search button.
 *
 * dispatches ({@link dispatchSearchValToWorker}) message to service worker to initiate query modification.
 */
function attachSubmitListenerToForm() {
  const searchField: searchElement | null = document.querySelector(
    '[aria-label="Search"]'
  )
  const searchForm: HTMLElement | null = document.getElementById('tsf')

  searchForm
    ? (searchForm.onformdata = (e) => {
        e.preventDefault()
        console.log(e.formData)
      })
    : null
  console.log(searchField)

  searchField?.value
    ? dispatchSearchValToWorker({ newVal: searchField.value } as searchValue)
    : null
}
attachSubmitListenerToForm()

export {}
