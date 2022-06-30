/* eslint-disable @typescript-eslint/no-unused-vars */
//@vitest-environment jsdom
import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'

import {
  mockWithDataText,
  mockWithNothing,
  mockWithShopping,
} from './content.mocks'

const jsdom = require('jsdom')

describe('getAds and redify', () => {
  const redifyListMock = vi.fn((redifyListMock) => 0)
  function getAdsMock() {
    const adContainer: HTMLElement | null = document.getElementById('tads')
    adContainer &&
      redifyListMock(
        adContainer.querySelectorAll(
          'div[data-text-ad]'
        ) as NodeListOf<HTMLElement>
      )
    const shoppingAdContainer: HTMLCollection | null =
      document.getElementsByClassName('cu-container')
    shoppingAdContainer &&
      redifyListMock(
        document.querySelectorAll('a[data-offer-id]') as NodeListOf<HTMLElement>
      )
  }
  afterEach(redifyListMock.mockClear)
  it('should have document'),
    () => {
      const { document } = new JSDOM(`${mockWithDataText}`).window
      expect(document).toBeDefined()
    }
  it('should find ads and call redify once', () => {
    const { document } = new JSDOM(`${mockWithDataText}`).window
    getAdsMock()
    expect(redifyListMock).toHaveBeenCalledTimes(1)
  })
  it('should find shopping ads and call redify once', () => {
    const { document } = new JSDOM(`${mockWithShopping}`).window
    getAdsMock()
    expect(redifyListMock).toHaveBeenCalledTimes(1)
  })
  it('should find nothing and not call redifyAds', () => {
    const { document } = new JSDOM(`${mockWithNothing}`).window
    const redifyListMock = vi.fn(() => 0)
    getAdsMock()
    expect(redifyListMock).toHaveBeenCalledTimes(0)
  })
})
