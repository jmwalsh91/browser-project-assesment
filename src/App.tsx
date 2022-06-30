import { ThemeProvider } from '@mui/material/styles'

import PopUpBody from './components/PopUpBody'
import { theme } from './styles/theme'

/**
 * Documentatio re App
 * @returns {@link PopUpBody} wrapped in {@link ThemeProvider}
 */
export function App() {
  return (
    <ThemeProvider theme={theme}>
      <PopUpBody />
    </ThemeProvider>
  )
}
