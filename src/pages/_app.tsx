import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar'
import { theme } from '../theme'

const App = ({ Component, pageProps }: AppProps) => (
  <ChakraProvider theme={theme}>
    <ProgressBar height="4px" shallowRouting />
    <Component {...pageProps} />
  </ChakraProvider>
)

export default App
