import Header from "../components/Header"
import Card from "../components/Card"
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Container,
    Icon,
    Button,
    Center,
    Box,
    Heading,
    Flex
  } from '@chakra-ui/react'

import { 
    GiLaurelsTrophy
} from "react-icons/gi";

import Link from "next/link";


export default function HomePage(props){
    return (
        <>
          <Header></Header>
          <Container  maxW='container.lg'>
                <Card title="Campeões">
                    <TableContainer>
                        <Table size="md" colorScheme="tableScheme">
                          <Thead>
                            <Tr>
                              <Th>Temporada</Th>
                              <Th>Campeão</Th>
                              <Th></Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                          {Object.entries(props.seasons).sort((a, b) => parseInt(b[0]) - parseInt(a[0])).map(
                            ([seasonNum, season]) => <Season season={seasonNum} owners={season.owners} playoffs={season.playoffs} />
                          )}
                          </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
            </Container>
        </>
      )
}

function Season(props){
    return (
        <Tr>
            <Td fontWeight="800">{props.season}</Td>
            <Td>
              <Flex>
                <Center>
                  <Icon w={10} h={10} mr="15px" verticalAlign="middle" as={GiLaurelsTrophy} />
                </Center>
                <Box>
                  <Heading>{props.owners[props.playoffs[0].teamId].teamName}</Heading>
                  <Heading fontSize="sm" fontWeight={500} color="gray.600">{props.owners[props.playoffs[0].teamId].ownerName}</Heading>
                </Box>
              </Flex>
            </Td>
            <Td><Link href={"/season/"+props.season+"/standings"}><Button colorScheme="blue">Ver Temporada</Button></Link></Td>
        </Tr>
    )
}


export async function getStaticProps(){
  const fs = require('fs');

    try {
        const seasonsDirData = fs.readdirSync('../data/WatchYourMouthLeague', 'utf8');
        const seasonsArray = seasonsDirData.map((elem) => parseInt(elem)).filter((elem) => !!elem)

        const seasonsData = {}
        seasonsArray.map((season) => {
          seasonsData[season] = getSeasonData(season)
        })
        
        return {
            props: {
                'seasons': seasonsData,
            }
        }
    } catch (err) {
        console.error(err);
    }
}

function getSeasonData(season){
  const fs = require('fs');

    try {
        const dataPlayoffsSeason = fs.readFileSync('../data/WatchYourMouthLeague/'+season+'/playoffs.json', 'utf8');
        const seasonPlayoffsJson = JSON.parse(dataPlayoffsSeason)

        const dataOwners = fs.readFileSync('../data/WatchYourMouthLeague/'+season+'/owners.json', 'utf8');
        const ownersJson = JSON.parse(dataOwners)

        return {
            playoffs: seasonPlayoffsJson,
            owners: ownersJson
        }
    } catch (err) {
    console.error(err);
    }
}