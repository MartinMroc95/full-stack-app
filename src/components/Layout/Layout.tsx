import React from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'
import { HStack, Text, VStack } from '@chakra-ui/react'
import Link from 'next/link'

interface Props {
  children: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => {
  const { user } = useUser()

  return (
    <HStack gap="10px" h="100vh" spacing={0}>
      <VStack
        zIndex="sticky"
        justifyContent="center"
        w="120px"
        h="full"
        px="10px"
        py="30px"
        borderRadius="0px 25px 25px 0px"
        bgColor="wheat"
      >
        <VStack>
          <Text>User:</Text>
          <Text>{user?.email}</Text>
        </VStack>

        <Link href="/api/auth/logout">Logout</Link>
      </VStack>
      {children}
    </HStack>
  )
}
