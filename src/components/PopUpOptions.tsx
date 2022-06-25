import { Stack, Switch, Typography } from '@mui/material'
import { Container } from '@mui/system'

function PopUpOptions() {
  return (
    <Container>
      <Stack direction="row" gap={1} justifyContent="space-between">
        <Typography variant="h5"> Option</Typography> <Switch />
      </Stack>
    </Container>
  )
}

export default PopUpOptions
