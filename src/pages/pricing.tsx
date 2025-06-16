import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import Head from 'next/head'
import Pricing from 'routes/Pricing'
import { NextPageWithLayout } from './_app'

const PricingPage: NextPageWithLayout = () => (
  <>
    <Head>
      <title>Main page</title>
    </Head>
    <Pricing />
  </>
)

export const getServerSideProps = withPageAuthRequired()

export default PricingPage
