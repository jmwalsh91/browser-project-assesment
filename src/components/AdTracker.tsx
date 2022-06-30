import { Skeleton, Stack } from '@mui/material'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import AdData from './AdData'
import ErrorFallback from './ErrorFallback'
/**
 * @function AdTracker
 * Wrapper component for the AdData component, providing Suspense and Error Boundary wrappers. This component is used to render the AdData component in the PopUpBody component.
 * @returns {@link AdData} - AdData component inside {@link Suspense} and {@link ErrorBoundary} wrappers.
 */
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
