import React from 'react'
import { HStack, Text } from '@chakra-ui/react'

interface Props {
  children: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => (
  <HStack gap="10px" h="100vh" spacing={0}>
    <HStack
      zIndex="sticky"
      justifyContent="center"
      minW="90px"
      h="full"
      py="30px"
      borderRadius="0px 25px 25px 0px"
      bgColor="wheat"
    >
      <Text color="black">SideBar</Text>
    </HStack>
    {children}
  </HStack>
)
