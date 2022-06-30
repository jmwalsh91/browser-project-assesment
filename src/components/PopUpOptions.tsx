/* eslint-disable react/no-unescaped-entities */
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Button, Skeleton, Stack, Switch, Typography } from '@mui/material'
import { Container } from '@mui/system'
import { Suspense, useEffect, useState, useTransition } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import useSWR from 'swr'

import {
  getCurrentAppendStatus,
  handleAppendToggle,
} from '~/utils/func/optionHandlers'

import OptionsErrorFallback from './OptionsErrorFallback'
/**
 * @function PopUpOptions
 * Handles setting of user preference re: 'append 2021'
 * @returns {ReactJSXElement}
 */
function PopUpOptions() {
  /**In the event that the update takes a perceptible amount of time, indicate to the user that the update is in progress */
  const [isUpdating, startUpdating] = useTransition()
  /**Get the current status of the 'append 2021' option */
  const { data } = useSWR('appendStatus', getCurrentAppendStatus, {
    suspense: true,
  })
  useEffect(() => {
    console.log(data)
  }, [data])
  const [checked, setChecked] = useState(data)
  /**conditional string literal to be used in css literal while isUpdating === true */
  const updateStyle = isUpdating ? `opacity: .7;` : ''
  /**
   * Handles the toggle of the 'append2021' option and updates the entry in storage
   */
  const handleSave = () => {
    console.log('handling save')
    startUpdating(() => {
      console.log(checked + 'start updating')
      checked !== undefined
        ? handleAppendToggle(checked)
        : handleAppendToggle(true)
    })
  }
  return (
    <Container>
      <Stack direction="row" gap={1} justifyContent="space-between">
        <Typography variant="body1"> Append queries with 'in 2021'?</Typography>{' '}
        <ErrorBoundary FallbackComponent={OptionsErrorFallback}>
          <Suspense fallback={<Skeleton />}>
            <Switch
              inputProps={{
                role: 'switch',
                'aria-label': 'Toggle Append Preference',
              }}
              checked={checked}
              css={css`
                ${updateStyle}
              `}
              onClick={() => setChecked(!checked)}
            />
          </Suspense>
        </ErrorBoundary>
      </Stack>
      {data}
      <Button
        variant="contained"
        onClick={() => {
          handleSave()
        }}
        css={css`
          background: rgba(27, 5, 5, 0.43);
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5.3px);
          -webkit-backdrop-filter: blur(5.3px);
          border: 1px solid rgba(27, 5, 5, 0.51);
          /* From https://css.glass */
          background: rgba(27, 5, 5, 0.43);
          border-radius: 16px;
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(5.3px);
          -webkit-backdrop-filter: blur(5.3px);
          border: 1px solid rgba(27, 5, 5, 0.51);
        `}
      >
        Save
      </Button>
    </Container>
  )
}

export default PopUpOptions
