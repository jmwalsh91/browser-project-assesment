import { RenderResult, cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactElement } from 'react'
import { afterEach } from 'vitest'

import PopUpWrapper from '../../components/PopUpWrapper'

afterEach(() => {
  cleanup()
})

const customRender = (ui: ReactElement): RenderResult =>
  render(ui, {
    wrapper: ({ children }) => <PopUpWrapper>{children}</PopUpWrapper>,
  })

export * from '@testing-library/react'
export { customRender as render, userEvent }
