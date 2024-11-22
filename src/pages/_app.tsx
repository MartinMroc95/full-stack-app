import { ReactElement, ReactNode } from 'react'
import { ApolloProvider } from '@apollo/client'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { ChakraProvider } from '@chakra-ui/react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar'
import apolloClient from '../../lib/apollo'
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
    <UserProvider>
      <ApolloProvider client={apolloClient}>
        <ChakraProvider theme={theme}>
          <ProgressBar height="4px" shallowRouting />
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </ApolloProvider>
    </UserProvider>
  )
}

export default App
