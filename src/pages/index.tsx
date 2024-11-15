import { ReactElement } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Head from 'next/head'
import Layout from 'components/Layout'
import Main from 'routes/Main'
import { NextPageWithLayout } from './_app'

const MainPage: NextPageWithLayout = () => (
  <>
    <Head>
      <title>Main page</title>
    </Head>
    <Main />
  </>
)

MainPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()

export default MainPage
