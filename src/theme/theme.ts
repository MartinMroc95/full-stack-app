import { extendTheme } from '@chakra-ui/react'
import { Styles } from '@chakra-ui/theme-tools'

const globalStyles: Styles = {
  global: {
    html: {
      fontSize: '14px',
      scrollBehavior: 'smooth',
    },
    body: {
      background: 'brand.purple.50',
      minHeight: '100vh',
      minWidth: '320px',
      overflowWrap: 'break-word',
      wordWrap: 'break-word',
      wordBreak: ['break-all', 'break-word'],
      hyphens: 'manual',
    },
    'a, button': {
      touchAction: 'manipulation',
    },
    '.js-focus-visible :focus:not(.focus-visible), .js-focus-visible :focus:not(.focus-visible) + [data-focus]':
      { outline: 'none', shadow: 'none' },
    '.chakra-checkbox': { zIndex: 1 },
  },
}

const customTheme = {
  styles: globalStyles,

  initialColorMode: 'light',
  useSystemColorMode: false,
}

export const theme = extendTheme(customTheme)
export type CustomTheme = typeof customTheme
