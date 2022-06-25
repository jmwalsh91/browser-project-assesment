import { Button, Paper } from '@mui/material'

import AdTracker from './AdTracker'
import Header from './Header'
import PopUpOptions from './PopUpOptions'

function PopUpBody() {
  return (
    <Paper
      sx={{
        width: 300,
      }}
      elevation={6}
    >
      <Header />
      <AdTracker />
      <PopUpOptions />
      <Paper
        elevation={2}
        sx={{
          p: 1,
          display: 'flex',
          direction: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Button variant="contained">Action</Button>
        <Button variant="contained">Action</Button>
      </Paper>
    </Paper>
  )
}

export default PopUpBody
