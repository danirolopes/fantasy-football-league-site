import Card from "../../../components/Card"
import Link from "next/link"
import { useRouter } from 'next/router'
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Container,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Button
  } from '@chakra-ui/react'
import SeasonNav from "../../../components/SeasonNav";
import { getSeasonsPaths } from "../../../lib/util"


export default function WeeksPage(props){
    return (
        <>
          <Container  maxW='container.lg'>
            <SeasonNav />
                <Card title="Confrontos">
                    <Tabs variant='soft-rounded'>
                        <WeeksList weeks={props.weeks} />
                        <Weeks weeks={props.weeks} />
                    </Tabs>
                </Card>
            </Container>
        </>
      )
}

function WeeksList(props){
    return (
        <TabList mt="15px">
            {Object.keys(props.weeks).map((weekNum) => <Tab>{weekNum}</Tab>)}
        </TabList>
    )
}

function Weeks(props){
    return (
        <TabPanels mt="15px">
            {Object.entries(props.weeks).map(([weekNum, week]) => <TabPanel><Week weekNum={weekNum} week={week}/></TabPanel>)}
        </TabPanels>
    )
}

function Week(props){
    return (
        <TableContainer>
            <Table variant='striped' size="md" colorScheme="tableScheme">
                <Thead>
                <Tr>
                    <Th>Vencedor</Th>
                    <Th>Pts</Th>
                    <Th></Th>
                    <Th>Pts</Th>
                    <Th>Perdedor</Th>
                    <Th></Th>
                </Tr>
                </Thead>
                <Tbody>
                    {Object.values(props.week).sort((a ,b) => {return parseFloat(b.ptsWinner) - parseFloat(a.ptsWinner)}).map((matchup) => <Matchup weekNum={props.weekNum} matchup={matchup} />)}
                </Tbody>
            </Table>
        </TableContainer>
    )
}


function Matchup(props){
    const router = useRouter()
    return (
        <Tr>
            <Td fontWeight={800}>{props.matchup.teamWinner}</Td>
            <Td fontWeight={800}>{props.matchup.ptsWinner}</Td>
            <Td> X </Td>
            <Td>{props.matchup.ptsLoser}</Td>
            <Td>{props.matchup.teamLoser}</Td>
            <Td><Link href={"/season/"+router.query.season+"/"+props.weekNum+"/"+props.matchup.matchupId}><Button colorScheme="blue">Ver Matchup</Button></Link></Td>
        </Tr>
    )
}

export async function getStaticPaths(){
    return getSeasonsPaths()
}

export async function getStaticProps(context){
    const fs = require('fs');

    try {
        const seasonDirData = fs.readdirSync('../data/WatchYourMouthLeague/'+context.params.season, 'utf8');
        const weeksArray = seasonDirData.map((elem) => parseInt(elem)).filter((elem) => !!elem)

        const weeksData = {}
        weeksArray.map((weekNum) => {
            weeksData[weekNum] = getWeekMatchups(context.params.season, weekNum)
        })
        return {
            props: {
                'weeks': weeksData,
            }
        }
    } catch (err) {
        console.error(err);
    }
}

function getWeekMatchups(season, weekNum){
    const fs = require('fs');

    try {
        const weekDirData = fs.readdirSync('../data/WatchYourMouthLeague/'+season+"/"+weekNum, 'utf8');
        
        const weekMatchups = weekDirData.map((matchupFilename, index) => {
            const [winnerString, loserString] = matchupFilename.replace(".json", "").split(" XXX ");
            return {
                "matchupId": index,
                "teamWinner": winnerString.split(" | ")[0],
                "ptsWinner": winnerString.split(" | ")[1],
                "teamLoser": loserString.split(" | ")[0],
                "ptsLoser": loserString.split(" | ")[1],
            }
        })


        return weekMatchups
    } catch (err) {
        console.error(err);
    }
}