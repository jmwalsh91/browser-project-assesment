import React from 'react'

type Props = {
  error: any
}

function ErrorFallback({ error }: Props) {
  return <div>Error</div>
}

export default ErrorFallback
