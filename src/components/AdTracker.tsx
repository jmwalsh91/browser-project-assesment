/* global chrome */
import { Skeleton, Stack } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import AdData from './AdData'
import ErrorFallback from './ErrorFallback'

function AdTracker() {
  return (
    <Stack direction="row">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton width={280} height={200} />}>
          <AdData />
        </Suspense>
      </ErrorBoundary>
    </Stack>
  )
}

export default AdTracker
