import Head from 'next/head'

export default function Header(){
    return (
        <>
            <Head>
                <title>WYML Fantasy Football</title>
                <meta name="description" content="Página da Liga de Fantasy Football Watch Your Mouth" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header>WYML</header>
        </>
    )
}