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
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Box
  } from '@chakra-ui/react'

import SeasonNav from "../../../components/SeasonNav";
import { getSeasonsPaths } from "../../../lib/util"


export default function DraftPage(props){
    return (
        <>
          <Container  maxW='container.lg'>
            <SeasonNav />
                <Card title="Draft">
                    <Tabs variant='soft-rounded'>
                        <DraftRoundsList draft={props.draft} />
                        <DraftRounds draft={props.draft} owners={props.owners} />
                    </Tabs>
                </Card>
            </Container>
        </>
      )
}

function DraftRoundsList(props){
    return (
        <TabList mt="15px">
            {Object.keys(props.draft).map((roundNum) => <Tab>{roundNum}</Tab>)}
        </TabList>
    )
}

function DraftRounds(props){
    return (
        <TabPanels mt="15px">
            {Object.values(props.draft).map((round) => <TabPanel><Round round={round} owners={props.owners}/></TabPanel>)}
        </TabPanels>
    )
}

function Round(props){
    return (
        <TableContainer>
            <Table variant='striped' size="md" colorScheme="tableScheme">
                <Thead>
                <Tr>
                    <Th>Pick</Th>
                    <Th>Jogador</Th>
                    <Th>Time</Th>
                </Tr>
                </Thead>
                <Tbody>
                    {Object.values(props.round).map((pick) => <Pick pick={pick} owners={props.owners} />)}
                </Tbody>
            </Table>
        </TableContainer>
    )
}


function Pick(props){
    return (
        <Tr>
            <Td>{props.pick.round}.{props.pick.pickRound}</Td>
            <Td>
                <Box fontWeight={800}>
                    {props.pick.playerName}
                </Box>
                <Box color="gray.600" mt="0.3rem">
                    {props.pick.playerPosition}
                </Box>
            </Td>
            <Td>{props.owners[props.pick.teamId].teamName}</Td>
        </Tr>
    )
}


export async function getStaticPaths(){
    return getSeasonsPaths()
}

export async function getStaticProps(context){
    const fs = require('fs');

    try {
        const dataDraft = fs.readFileSync('../data/WatchYourMouthLeague/'+context.params.season+'/draft.json', 'utf8');
        const draftJson = JSON.parse(dataDraft)

        const dataOwners = fs.readFileSync('../data/WatchYourMouthLeague/'+context.params.season+'/owners.json', 'utf8');
        const ownersJson = JSON.parse(dataOwners)

        return {
            props: {
                'draft': draftJson,
                'owners': ownersJson
            }
        }
    } catch (err) {
    console.error(err);
    }
}