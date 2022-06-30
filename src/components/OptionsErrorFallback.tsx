import React from 'react'

/**
 * @function ErrorFallback
 * @param error {@link ErrorBoundary} error object
 * @returns error.message
 */
function OptionsErrorFallback({ error }: any) {
  return <div>{error.message}</div>
}

export default OptionsErrorFallback
