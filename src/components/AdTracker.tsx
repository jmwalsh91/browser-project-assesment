import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import Container from '@mui/system/Container'

function AdTracker() {
  return (
    <Card sx={{ backgroundColor: 'bisque' }}>
      <CardHeader>AdTracker</CardHeader>
      <CardContent>
        <Stack direction="row">
          <Container>
            <Typography variant="h5">Ads seen</Typography>
            <Typography variant="subtitle1">Past 24 hours</Typography>
          </Container>
          <Container>
            <Typography variant="h1">25 </Typography>
          </Container>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AdTracker
