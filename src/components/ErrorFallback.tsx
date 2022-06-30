import React from 'react'

type Props = {
  error: any
}
/**
 * @function ErrorFallback Fallback for ErrorBoundary
 * @param error {@link ErrorBoundary} error object 
 * @returns error.message
 */
function ErrorFallback({ error }: Props) {
  return <div>{error.message}</div>
}

export default ErrorFallback
