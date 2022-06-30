/**
 * Setter for current user preference re: append 2021 to search query.
 *
 * @param newAppendStatus boolean
 */
export function handleAppendToggle(newAppendStatus: boolean): boolean {
  console.log(newAppendStatus + 'is newAppendStatus')
  const result = chrome.storage.sync.set(
    { append2021: newAppendStatus },
    function () {
      chrome.runtime.lastError
        ? chrome.runtime.lastError
        : console.log('Append newAppendStatus set to ' + newAppendStatus)
      return chrome.storage.sync.get('append2021')
    }
  )
  console.log(result)
  console.log('is result')
  return newAppendStatus as boolean
}
/**
 * Getter for current user preference re: Append queries with 'in 2021'?
 * @returns Promise<boolean>
 */
export async function getCurrentAppendStatus(): Promise<boolean> {
  console.log('getCurrentAppendStatus')
  let { appendStatus } = await chrome.storage.sync.get('append2021')
  if (appendStatus === undefined) {
    console.log('appendStatus is undefined')
    chrome.storage.sync.set({ append2021: false })
    appendStatus = false
  }
  console.log(appendStatus)
  console.log(' is appendStatus')
  return appendStatus as boolean
}
