import { Flex } from '@chakra-ui/react'
import Head from 'next/head'
import Link from 'next/link'

const Home = () => (
  <>
    <Head>
      <title>Create Next App</title>
    </Head>
    <Flex align="center" justify="center" w="full" h="full" p="20px">
      NextJS App
    </Flex>
    <Link href="./page">Home page</Link>
  </>
)

export default Home
