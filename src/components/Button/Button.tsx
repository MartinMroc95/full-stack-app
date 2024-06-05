import React from 'react'
import { Button as ChakraButton } from '@chakra-ui/react'

export const Button = ({ children }: any) => (
  <ChakraButton colorScheme="blue">{children}</ChakraButton>
)
