import '../styles/globals.css'
import { ChakraProvider, extendTheme} from '@chakra-ui/react'

import PageWrapper from '../components/PageWrapper'

const themeConfig = {
  colors: {
    brand: {
      "50": "#FCE9E9",
      "100": "#F6C0C0",
      "200": "#F19898",
      "300": "#EB7070",
      "400": "#E54848",
      "500": "#E01F1F",
      "600": "#B31919",
      "700": "#861313",
      "800": "#590D0D",
      "900": "#2D0606"
    },
    tableScheme: {
      "100": "#ccc",
      "700": "#ccc"
    }
  },
  styles: {
    global: {
      body: {
        bg: 'gray.500',
      },
    }
  },
  components: {
    Tabs: {
      baseStyle:{
        tabpanel:{
          p: 0
        },
        tablist:{
          overflowX: "auto"
        }
      }
    }
  }
}

const theme = extendTheme( themeConfig )

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <PageWrapper>
        <Component {...pageProps} />
      </PageWrapper>
    </ChakraProvider>
  )
}

export default MyApp
