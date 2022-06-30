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
      const outcome = chrome.runtime.lastError
        ? chrome.runtime.lastError
        : chrome.storage.sync.get('append2021')

      return outcome
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
  let { append2021 } = await chrome.storage.sync.get('append2021')
  if (append2021 === undefined) {
    console.log('append2021 is undefined')
    chrome.storage.sync.set({ append2021: false })
    append2021 = false
  }
  console.log(append2021)
  console.log(' is append2021')
  return append2021 as boolean
}
