import {
    Box,
    Heading
  } from '@chakra-ui/react'

export default function Card(props) {
    const styleOuter = {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
        borderRadius: "1.5rem",
        minWidth: "0px",
        wordWrap: "break-word",
        backgroundClip: "border-box",
        overflow: "hidden",
        marginTop: "1.5rem",
        marginBottom: "1.5rem"
    }

    const styleHeader = {
        p: "1.5rem",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
        minWidth: "0px",
        wordWrap: "break-word",
        bg: "#fff",
        backgroundClip: "border-box",
    }

    const styleContent = {
        p: "1.5rem",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        position: "relative",
        minWidth: "0px",
        wordWrap: "break-word",
        bg: "#f0f0f0",
        backgroundClip: "border-box",
    }


    return (
        <Box sx={styleOuter}>
            <Box sx={styleHeader}>
                <Heading ml="15px">{props.title}</Heading>
            </Box>
            <Box sx={styleContent}>
                {props.children}
            </Box>
        </Box>
    )
}