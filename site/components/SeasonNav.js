import {
    Button,
    ButtonGroup
  } from '@chakra-ui/react'

import Link from 'next/link';
import { useRouter } from 'next/router';
import Card from './Card';

export default function SeasonNav(props) {
    const router = useRouter();
    return (
        <Card title={"Temporada "+router.query.season}>
            <ButtonGroup spacing={4} direction='row' align='center'>
                <Link href={"/season/"+router.query.season+"/standings"}><Button variant={(router.pathname.includes("standings"))?"solid":"outline"} flex="1" colorScheme="blue">Resumo</Button></Link>
                <Link href={"/season/"+router.query.season+"/weeks"}><Button variant={(router.pathname.includes("weeks"))?"solid":"outline"} flex="1" colorScheme="blue">Confrontos</Button></Link>
                <Link href={"/season/"+router.query.season+"/draft"}><Button variant={(router.pathname.includes("draft"))?"solid":"outline"} flex="1" colorScheme="blue">Draft</Button></Link>
            </ButtonGroup>
        </Card>
    )
}