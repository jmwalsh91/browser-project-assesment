import { Typography } from '@mui/material'
import Box from '@mui/material/Box'

function Header() {
  return (
    <Box
      sx={{
        height: '3rem',
        backgroundColor: 'primary.main',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          p: 1,
        }}
      >
        ThingApp
      </Typography>
    </Box>
  )
}

export default Header
