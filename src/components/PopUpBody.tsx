import { Button, Container, Paper, Skeleton, Typography } from '@mui/material'
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
        width: 300,
        height: 300,
      }}
      elevation={6}
    >
      <Header />
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AdTracker />
      </ErrorBoundary>
      <ErrorBoundary FallbackComponent={OptionsErrorFallback}>
        <Suspense fallback={<Skeleton />}>
          <PopUpOptions />
        </Suspense>
      </ErrorBoundary>
      <Container
        sx={{
          p: 1,
          display: 'flex',
          direction: 'row',
          justifyContent: 'space-between',
        }}
      ></Container>
    </Paper>
  )
}

export default PopUpBody
