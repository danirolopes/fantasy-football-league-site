import Header from "../../../../components/Header"
import Card from "../../../../components/Card"
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Container,
    Flex,
    Box,
    Heading, 
    Text,
    Center,
    SimpleGrid
  } from '@chakra-ui/react'
import { useRouter } from "next/router"
import SeasonNav from "../../../../components/SeasonNav";



export default function MatchupPage(props){
    const router = useRouter()
    return (
        <>
          <Header></Header>
          <Container  maxW='container.lg'>
                <SeasonNav/>
                <Card title={"Semana "+router.query.week}>
                <Flex>
                    <TeamHeader owners={props.owners} team={props.matchup.teamWinner} direction="right"/>
                    <Center width="50px">VS</Center>
                    <TeamHeader owners={props.owners} team={props.matchup.teamLoser} direction="left"/>
                </Flex>
                <SimpleGrid columns={2} spacing={5}>
                    <Team team={props.matchup.teamWinner}/>
                    <Team team={props.matchup.teamLoser}/>
                </SimpleGrid>
                </Card>
            </Container>
        </>
      )
}

function TeamHeader(props){
    return (
        <Box flex='1'>
            <Heading size="xl" textAlign={props.direction}>{props.owners[props.team.teamId].teamName}</Heading>
            <Text color="gray.600" textAlign={props.direction}>{props.owners[props.team.teamId].ownerName}</Text>
            <Heading size="md" mt="15px" textAlign={props.direction}>{props.team.points}</Heading>
        </Box>
    )
}

function Team(props){
    return (
        <Box mt="20px">
            <Heading size="xs" textTransform="uppercase">Titulares</Heading>
            <TableContainer>
                <Table variant='striped' size="md" colorScheme="tableScheme">
                    <Thead>
                    <Tr>
                        <Th>Pos</Th>
                        <Th>Jogador</Th>
                        <Th>Pts</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {props.team.starters.map((player) => <Player player={player} />)}
                    </Tbody>
                </Table>
            </TableContainer>
            <Heading mt="15px" size="xs" textTransform="uppercase">Banco</Heading>
            <TableContainer>
                <Table variant='striped' size="md" colorScheme="tableScheme">
                    <Thead>
                    <Tr>
                        <Th>Pos</Th>
                        <Th>Jogador</Th>
                        <Th>Pts</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {props.team.bench.map((player) => <Player player={player} />)}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

function Player(props){
    return (
        <Tr>
            <Td>{props.player.teamPosition}</Td>
            <Td>{props.player.playerName}</Td>
            <Td>{props.player.points}</Td>
        </Tr>
    )
}

export async function getStaticPaths(){
    return getPaths()
}

function getPaths(){
    const fs = require('fs');
    try {
        const seasonsDirData = fs.readdirSync('../data/WatchYourMouthLeague', 'utf8');
        const seasonsArray = seasonsDirData.map((elem) => parseInt(elem)).filter((elem) => !!elem)

        let seasonsParams = []
        seasonsArray.map((seasonNum) => {
            seasonsParams = seasonsParams.concat(getSeasonWeeks(seasonNum))
        })
        return {
            paths: seasonsParams,
            fallback: false
        }
    } catch (err) {
        console.error(err);
    }
}

function getSeasonWeeks(season){
    const fs = require('fs');
    try {
        const seasonDirData = fs.readdirSync('../data/WatchYourMouthLeague/'+season, 'utf8');
        const weeksArray = seasonDirData.map((elem) => parseInt(elem)).filter((elem) => !!elem)

        let weeksParams = []
        weeksArray.map((weekNum) => {
            weeksParams = weeksParams.concat(getWeekMatchups(season, weekNum))
        })
        return weeksParams
    } catch (err) {
        console.error(err);
    }
}

function getWeekMatchups(season, week){
    const fs = require('fs');
    try {
        const weekDirData = fs.readdirSync('../data/WatchYourMouthLeague/'+season+'/'+week, 'utf8');
        
        const matchupsParams = []
        for(let i = 0; i < weekDirData.length; i++){
            matchupsParams.push({
                    params: {
                        season: season.toString(),
                        week: week.toString(),
                        matchup: i.toString()
                    }
            })
        }
        return matchupsParams
    } catch (err) {
        console.error(err);
    }
}

export async function getStaticProps(context){
    const fs = require('fs');

    try {
        const dataDirMatchup = fs.readdirSync('../data/WatchYourMouthLeague/'+context.params.season+'/'+context.params.week, 'utf8')
        const matchupFilename = dataDirMatchup[context.params.matchup]

        const datamatchup = fs.readFileSync('../data/WatchYourMouthLeague/'+context.params.season+'/'+context.params.week+'/'+matchupFilename, 'utf8');
        const matchupJson = JSON.parse(datamatchup)

        const dataOwners = fs.readFileSync('../data/WatchYourMouthLeague/'+context.params.season+'/owners.json', 'utf8');
        const ownersJson = JSON.parse(dataOwners)

        return {
            props: {
                'matchup': matchupJson,
                'owners': ownersJson
            }
        }
    } catch (err) {
    console.error(err);
    }
}