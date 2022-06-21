import { JSDOM } from 'jsdom'
import { describe, expect, it } from 'vitest'

import * as content from '../content'
import {
  mockWithDataText,
  mockWithShopping,
  mockWithNothing,
} from './content.mocks'

const jsdom = require('jsdom')

describe('getAds and redify', () => {
  it('should find ads and call redify once', () => {
    const { document } = new JSDOM(`${mockWithDataText}`).window
    getAds()
    expect(redifyList).toHaveBeenCalledTimes(1)
  })
  it('should find shopping ads and call redify once', () => {
    const { document } = new JSDOM(`${mockWithShopping}`).window
    getAds()
    expect(redifyList).toHaveBeenCalledTimes(1)
  })
  it('should find nothing and not call redifyAds', () => {
    const { document } = new JSDOM(`${mockWithNothing}`).window
    getAds()
    expect(redifyList).toHaveBeenCalledTimes(0)
  })
})
