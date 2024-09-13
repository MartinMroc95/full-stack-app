import React from 'react'
import { Box } from '@chakra-ui/react'

interface Props {
  children: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => <Box bgColor="turquoise">{children}</Box>
