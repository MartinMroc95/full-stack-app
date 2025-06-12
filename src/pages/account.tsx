import { ReactElement } from 'react'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Head from 'next/head'
import { Layout } from 'components/Layout/Layout'
import Account from 'routes/Account/Account'
import { NextPageWithLayout } from './_app'

const AccountPage: NextPageWithLayout = () => (
  <>
    <Head>
      <title>Account page</title>
    </Head>
    <Account />
  </>
)

AccountPage.getLayout = (page: ReactElement) => <Layout>{page}</Layout>

export const getServerSideProps = withPageAuthRequired()

export default AccountPage
