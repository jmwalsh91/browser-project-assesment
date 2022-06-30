import { Paper, Skeleton, Stack } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import AdTracker from './AdTracker'
import ErrorFallback from './ErrorFallback'
import Header from './Header'
import OptionsErrorFallback from './OptionsErrorFallback'
import PopUpOptions from './PopUpOptions'

/**
 * @function PopUpBody
 * Main structure for the extension "popup" UI, providing the following components:
 *
 * {@link Header} - Header component
 *
 * {@link PopUpOptions} - Options component
 *
 * {@link AdTracker} - AdTracker component, which in turn renders the AdData component
 *
 * @returns {ReactJSXElement}
 */
function PopUpBody() {
  return (
    <Paper
      sx={{
        width: '300px',
        height: '300px',
        m: 0,
        p: 0,
      }}
      elevation={6}
    >
      <Header />
      <Stack
        direction="column"
        alignItems={'center'}
        justifyContent={'space-around'}
        spacing={2}
      >
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AdTracker />
        </ErrorBoundary>
        <ErrorBoundary FallbackComponent={OptionsErrorFallback}>
          <Suspense fallback={<Skeleton />}>
            <PopUpOptions />
          </Suspense>
        </ErrorBoundary>
      </Stack>
    </Paper>
  )
}

export default PopUpBody
