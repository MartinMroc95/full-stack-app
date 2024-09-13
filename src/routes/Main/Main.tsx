import React from 'react'
import { Box, Flex } from '@chakra-ui/react'
import Link from 'next/link'

export const Main = () => (
  <Box>
    <Flex align="center" justify="center" w="full" h="full" p="20px">
      NextJS App
    </Flex>
    <Box fontSize="20px">Text</Box>
    <Link href="./page">Home page</Link>
  </Box>
)
