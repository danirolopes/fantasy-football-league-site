import Head from 'next/head'
import { 
    Image,
    Flex,
    Center ,
    Heading ,
    Box,
    Text,
    AspectRatio
} from '@chakra-ui/react'

import Link from 'next/link'

export default function PageWrapper(props){
    return (
        <>
            <Head>
                <title>WYML Fantasy Football</title>
                <meta name="description" content="Página da Liga de Fantasy Football Watch Your Mouth" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="author" content="danirolopes@gmail.com" />
            </Head>
            <Box as="header" mt="2rem" mb="2rem">
                <Center>
                    <Link href="/">
                        <Flex>
                            <Center>
                                <Image src="/football-64-102853.png" h={63} w={63} objectFit="cover" />
                            </Center>
                            <Center ml="1.3rem">
                                <Box>
                                    <Heading letterSpacing="2px" fontSize="4rem">WYML</Heading>
                                    <Text>Tradição Pesa</Text>
                                </Box>
                            </Center>
                        </Flex>
                    </Link>
                </Center>
            </Box>
            {props.children}
        </>
    )
}