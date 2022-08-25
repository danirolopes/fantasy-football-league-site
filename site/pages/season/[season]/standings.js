import Header from "../../../components/Header"
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
    Icon
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
          <Header></Header>
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
                                <Th>Dono</Th>
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
            <Td fontWeight="800">{ownersDict[line.teamId].teamName}</Td>
            <Td>{ownersDict[line.teamId].ownerName}</Td>
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
                <Td fontWeight={800} fontSize="20px"><Icon w={20} h={20} mr="15px" verticalAlign="middle" as={GiLaurelsTrophy} /> Campeão</Td>
                <Td fontWeight={800} >{ownersDict[standings[0].teamId].teamName}</Td>
                <Td fontWeight={800} >{ownersDict[standings[0].teamId].ownerName}</Td>
            </Tr>
            <Tr>
                <Td fontSize="20px"><Icon w={12} h={12} ml="16px" mr="30px" verticalAlign="middle" as={IoMedalOutline} /> Vice-campeão</Td>
                <Td>{ownersDict[standings[1].teamId].teamName}</Td>
                <Td>{ownersDict[standings[1].teamId].ownerName}</Td>
            </Tr>
            <Tr>
                <Td fontSize="20px"><Icon w={12} h={12} ml="16px" mr="30px" verticalAlign="middle" as={IoMedalSharp} /> Terceiro Lugar</Td>
                <Td>{ownersDict[standings[2].teamId].teamName}</Td>
                <Td>{ownersDict[standings[2].teamId].ownerName}</Td>
            </Tr>
            <Tr>
                <Td fontSize="20px"><Icon w={12} h={12} ml="16px" mr="30px" verticalAlign="middle" as={GiTrophy} /> Campeão Consolo</Td>
                <Td>{ownersDict[standings[4].teamId].teamName}</Td>
                <Td>{ownersDict[standings[4].teamId].ownerName}</Td>
            </Tr>
            <Tr>
                <Td fontSize="20px"><Icon w={12} h={12} ml="16px" mr="30px" verticalAlign="middle" as={GiTrashCan} /> Lanterna</Td>
                <Td>{ownersDict[standings[standings.length-1].teamId].teamName}</Td>
                <Td>{ownersDict[standings[standings.length-1].teamId].ownerName}</Td>
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