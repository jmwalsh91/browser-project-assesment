import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#65abba',
    },
    secondary: {
      main: '#d070be',
    },
    error: {
      main: '#f9494b',
    },
    warning: {
      main: '#E0981E',
    },
    info: {
      main: '#328d80',
    },
    background: {
      default: '#1a1818',
      paper: '#2f2c2c',
    },
    divider: 'rgba(201,192,192,0.75)',
    text: {
      primary: '#f5f2f2',
    },
  },
})
