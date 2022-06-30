import React from 'react'

function OptionsErrorFallback({ error }: any) {
  return <div>{error.message}</div>
}

export default OptionsErrorFallback
