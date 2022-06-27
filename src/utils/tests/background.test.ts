/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expect, it } from 'vitest'
/**
 * interface for mocks
 */
interface AdsMSGDataMock {
  adsEncountered: AdsEncounteredMock
}
interface AdsEncounteredMock {
  time: number
  quantity: number
}
type AdsEncounteredArray = [
  AdsEncounteredMock['time'],
  AdsEncounteredMock['quantity']
][]
const storageMocks = {
  hasData: {
    adsEncountered: [
      [1519211809934, 5],
      [1519211811670, 2],
      [1519211810362, 26],
    ],
  },
  noData: {},
}
type msg = {
  reason: string
  adsEncountered: AdsEncounteredMock
}
/**
 * mocks for data
 */
const msgMock = {
  reason: 'storeAds',
  adsEncountered: { time: Date.now(), quantity: 4 },
}
/**
 * fake onMessage listener
 */
function listenerMock(message: msg) {
  const adMemoryMock = vi.fn((adMemoryMock) => 0)
  message.reason === 'storeAds' ? adMemoryMock(message.adsEncountered) : null
}
async function getMock(outcome: string) {
  const result =
    outcome === 'hasData'
      ? await Promise.resolve(storageMocks.hasData)
      : await Promise.resolve(storageMocks.noData)
  return result
}

/**
 *
 * @param time time ad encountered
 * @param quantity quantity of ads
 * @returns
 */
const adMemoryMock = function ({ time, quantity }: AdsEncounteredMock) {
  /**
   * initializes adMemory in db
   * @param data
   */
  function initAdMemoryMock(
    time: AdsEncounteredMock['time'],
    quantity: AdsEncounteredMock['quantity']
  ) {
    chrome.storage.sync.set({ adsEncountered: [time, quantity] })
  }
  /**
   * appends array of adsData
   * @param data
   */
  function appendAdMemoryMock(
    adsEncounteredArray: AdsEncounteredArray,
    time: AdsEncounteredMock['time'],
    quantity: AdsEncounteredMock['quantity']
  ) {
    console.log('adsEncountered')
    adsEncounteredArray.push([time, quantity])
    console.log(adsEncounteredArray)
    console.log('after push')
    chrome.storage.sync.set({ adsEncountered: adsEncounteredArray })
  }
  /**
   * gets adsInStorage and conditionally updates storage
   * @param data
   */
  async function updateMock(
    time: AdsEncounteredMock['time'],
    quantity: AdsEncounteredMock['quantity']
  ) {
    const adsInStorage = await chrome.storage.sync
      .get('adsEncountered') //[time, quantity]
      .then((data) => {
        const adsEncounteredArray = data.adsEncounteredArray
        adsEncounteredArray
          ? appendAdMemoryMock(adsEncounteredArray, time, quantity)
          : initAdMemoryMock(time, quantity)
      })
    return adsInStorage
  }

  return updateMock(time, quantity)
}

describe('does the right thing', () => {
  it('should call adMemory', () => {
    const adMemoryMock = vi.fn((adMemoryMock) => 0)
    function listenerMock(message: msg) {
      message.reason === 'storeAds'
        ? adMemoryMock(message.adsEncountered)
        : null
    }
    listenerMock(msgMock)
    expect(adMemoryMock).toHaveBeenCalledTimes(1)
  })
  it('should call init', async () => {
    const result = await getMock('hasData')
    expect(result).toBe(storageMocks.hasData)
  })
})
