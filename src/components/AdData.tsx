import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
import { Stack } from '@mui/material'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import useSWR from 'swr'

import { storageManagement } from '~/utils/func/adsSeenMgmt'

async function adsSeenGetter(): Promise<{ adCount: number }> {
  const adCount = await chrome.storage.sync
    .get('adsEncountered')
    .then((data) => {
      console.log('data')
      console.log(data)
      //pass entries to storageManagement along with the current time (since epoch)
      const count = storageManagement(Date.now(), data)
      return count
    })
    .catch((error) => error({ message: ErrorEvent }))
  console.log('ad count before return in addata')
  console.log(adCount)
  return adCount
}
function AdData(): ReactJSXElement {
  const { data } = useSWR('adsEncountered', adsSeenGetter, {
    suspense: true,
  })
  return (
    <Stack direction="column" alignContent={'center'}>
      <Container>
        <Typography sx={{ fontSize: '3rem' }}>{data?.adCount}</Typography>
      </Container>
      <Typography variant="body1">Ads seen</Typography>
      <Typography variant="body1">`(Past 24 hours)`</Typography>
    </Stack>
  )
}

export default AdData
