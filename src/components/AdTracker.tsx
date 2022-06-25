/* global chrome */

import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import Container from '@mui/system/Container'
import useSWR from 'swr'

import { storageManagement } from '~/utils/func/adsSeenMgmt'

async function adsSeenGetter(): Promise<{
  adCount: number
}> {
  return chrome.storage.sync
    .get()
    .then(async (data) => {
      console.log(data)
      const count = await storageManagement(Date.now().toString(), data)
      return count
    })
    .catch((error) => error({ message: ErrorEvent }))
}

function AdTracker() {
  const { data } = useSWR('syncStorage', adsSeenGetter)

  return (
    <Card sx={{ backgroundColor: 'bisque' }}>
      <CardHeader>AdTracker</CardHeader>
      <CardContent>
        <Stack direction="row">
          <Container>
            <Typography sx={{ fontSize: '3rem' }}>Ads seen</Typography>
            <Typography sx={{ fontSize: '3rem' }}>Past 24 hours</Typography>
          </Container>
          <Container>
            <Typography sx={{ fontSize: '3rem' }}>{data?.adCount}</Typography>
          </Container>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AdTracker
