import { ReactElement, ReactNode } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar'
import { theme } from '../theme'

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ChakraProvider theme={theme}>
      <ProgressBar height="4px" shallowRouting />
      {getLayout(<Component {...pageProps} />)}
    </ChakraProvider>
  )
}

export default App
