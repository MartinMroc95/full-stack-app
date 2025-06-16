import { ReactElement, ReactNode } from 'react'
import { ApolloProvider } from '@apollo/client'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar'
import { Toaster } from 'sonner'
import apolloClient from '../../lib/apollo'
import { SubscriptionProvider } from '../context/SubscriptionContext'
import '../styles/globals.css'

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
      <SubscriptionProvider>
        <ApolloProvider client={apolloClient}>
          <ProgressBar height="4px" shallowRouting />
          {getLayout(<Component {...pageProps} />)}
          <Toaster position="top-center" />
        </ApolloProvider>
      </SubscriptionProvider>
    </UserProvider>
  )
}

export default App
