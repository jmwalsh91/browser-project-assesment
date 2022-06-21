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
 * If adContainer is truthy, call {@link redifyList} with array of elements as arg.
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
      shoppingAdContainer[0].querySelectorAll(
        'a[data-offer-id]'
      ) as NodeListOf<HTMLElement>
    )
}
//invoke getAds
getAds()
/**
 * FIXME: Figure out config: TS needs export statement here to circumvent duplicate function implementation err, and chrome does not like the presence of an import or export statement in the compiled script --> current solution is to manually delete the export statement in the dist folder, which is certainly not ideal.
 */
export {}
