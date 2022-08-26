import Card from "../../../components/Card"
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
    Box
  } from '@chakra-ui/react'

import { 
    GiLaurelsTrophy, 
    GiTrophy,
    GiTrashCan
} from "react-icons/gi";
import {
    IoMedalSharp,
    IoMedalOutline
} from "react-icons/io5"

import SeasonNav from "../../../components/SeasonNav";
import { getSeasonsPaths } from "../../../lib/util"


export default function StandingsPage(props){
    return (
        <>
          <Container  maxW='container.lg'>
                <SeasonNav/>
                <Card title="Destaques">
                    <TableContainer>
                        <Table size="md" colorScheme="tableScheme">
                            <Tbody>
                            {buildCampeoes(props.playoffs, props.owners)}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
                <Card title="Temporada Regular">
                    <TableContainer>
                        <Table variant='striped' size="md" colorScheme="tableScheme">
                            <Thead>
                            <Tr>
                                <Th></Th>
                                <Th>Time</Th>
                                <Th>Record</Th>
                                <Th>Pts Feitos</Th>
                                <Th>Pts Sofridos</Th>
                            </Tr>
                            </Thead>
                            <Tbody>
                            {props.regularSeason.map((elem) => standingLine(elem, props.owners))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
            </Container>
        </>
      )
}

function standingLine(line, ownersDict){
    return (
        <Tr key={line.rank}>
            <Td isNumeric>{line.rank}</Td>
            <Td>
                <Box fontWeight={800}>
                    {ownersDict[line.teamId].teamName}
                </Box>
                <Box color="gray.600" mt="0.3rem">
                    {ownersDict[line.teamId].ownerName}
                </Box>
            </Td>
            <Td>{line.record}</Td>
            <Td>{line.pointsFor}</Td>
            <Td>{line.pointsAgainst}</Td>
        </Tr>
    )
}

function buildCampeoes(standings, ownersDict){
    return (
        <>
            <Tr>
                <Td fontWeight={800} fontSize="1.5rem"><Icon w={20} h={20} mr="1rem" verticalAlign="middle" as={GiLaurelsTrophy} /> Campeão</Td>
                <Td fontWeight={800} >
                    <Box fontSize="1.5rem">
                        {ownersDict[standings[0].teamId].teamName}
                    </Box>
                    <Box color="gray.600" mt="0.8rem">
                        {ownersDict[standings[0].teamId].ownerName}
                    </Box>
                </Td>
            </Tr>
            <Tr>
                <Td fontSize="1.5rem"><Icon w={12} h={12} ml="1rem" mr="2rem" verticalAlign="middle" as={IoMedalOutline} /> Vice-campeão</Td>
                <Td>
                    <Box fontSize="1.5rem">
                        {ownersDict[standings[1].teamId].teamName}
                    </Box>
                    <Box color="gray.600" mt="0.8rem">
                        {ownersDict[standings[1].teamId].ownerName}
                    </Box>
                </Td>
            </Tr>
            <Tr>
                <Td fontSize="1.5rem"><Icon w={12} h={12} ml="1rem" mr="2rem" verticalAlign="middle" as={IoMedalSharp} /> Terceiro Lugar</Td>
                <Td>
                    <Box fontSize="1.5rem">
                        {ownersDict[standings[2].teamId].teamName}
                    </Box>
                    <Box color="gray.600" mt="0.8rem">
                        {ownersDict[standings[2].teamId].ownerName}
                    </Box>
                </Td>
            </Tr>
            <Tr>
                <Td fontSize="1.5rem"><Icon w={12} h={12} ml="1rem" mr="2rem" verticalAlign="middle" as={GiTrophy} /> Consolo</Td>
                <Td>
                    <Box fontSize="1.5rem">
                        {ownersDict[standings[4].teamId].teamName}
                    </Box>
                    <Box color="gray.600" mt="0.8rem">
                        {ownersDict[standings[4].teamId].ownerName}
                    </Box>
                </Td>
            </Tr>
            <Tr>
                <Td fontSize="1.5rem"><Icon w={12} h={12} ml="1rem" mr="2rem" verticalAlign="middle" as={GiTrashCan} /> Lanterna</Td>
                <Td>
                    <Box fontSize="1.5rem">
                        {ownersDict[standings[standings.length-1].teamId].teamName}
                    </Box>
                    <Box color="gray.600" mt="0.8rem">
                        {ownersDict[standings[standings.length-1].teamId].ownerName}
                    </Box>
                </Td>
            </Tr>
        </>
    )
}


export async function getStaticPaths(){
    return getSeasonsPaths()
}

export async function getStaticProps(context){
    const fs = require('fs');

    try {
        const dataregularSeason = fs.readFileSync('../data/WatchYourMouthLeague/'+context.params.season+'/regular_season.json', 'utf8');
        const regularSeasonJson = JSON.parse(dataregularSeason)

        const dataPlayoffs = fs.readFileSync('../data/WatchYourMouthLeague/'+context.params.season+'/playoffs.json', 'utf8');
        const playoffsJson = JSON.parse(dataPlayoffs)

        const dataOwners = fs.readFileSync('../data/WatchYourMouthLeague/'+context.params.season+'/owners.json', 'utf8');
        const ownersJson = JSON.parse(dataOwners)

        return {
            props: {
                "regularSeason": regularSeasonJson,
                'playoffs': playoffsJson,
                'owners': ownersJson
            }
        }
    } catch (err) {
    console.error(err);
    }
}