import PlayerQueue from "../components/PlayerQueue";
import Team from "../components/Team";
import Player from "../components/Players";
import playersStd from '../assets/jsonData_std.json';
import playersPpr from '../assets/jsonData_ppr.json';
import playersHalf from '../assets/jsonData_half.json';
import ding from '../assets/news-ting-6832.mp3';
import { useDebugValue, useEffect, useState, useRef } from "react";
import Favorites from "../components/Favorites";
import { Link, useLocation } from "react-router-dom";
import { AiFillHome, AiFillPlayCircle } from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { 
    Container, Paper, Grid, 
    Typography, Chip, Button, 
    IconButton, Divider, FormControl, 
    InputLabel, Select, MenuItem,
    Box, TableContainer, Table,
    TableHead, TableRow, TableCell,
    TableBody, useMediaQuery,
    Tabs, Tab
} from "@mui/material";
import { TabPanel, TabContext } from '@mui/lab';
import { blue, amber } from "@mui/material/colors";
import Helper from '../models/Helper';
import TeamObj from '../models/TeamObj';
import Teams from "../models/Teams";

const helper = new Helper();

const playersObj = {
    'Standard': JSON.parse(JSON.stringify(playersStd)),
    'PPR': JSON.parse(JSON.stringify(playersPpr)),
    'Half-PPR': JSON.parse(JSON.stringify(playersHalf))
};

// overallRanking, name, team, position, projections,
// lastSeasonPoints, positionRanking, flexRanking

function Mock() {
    const isWideScreen = useMediaQuery('(min-width: 800px)');
    const [tabValue, setTabValue] = useState('Teams');

    var leagueSize = 8;
    var queuePosition = 1;
    var leagueType = 'Standard';
    var positionSizes = {
        'QB': {size: 1}, 'RB': {size: 2}, 'WR': {size: 2},
        'TE': {size: 1}, 'FLEX': {size: 1}, 'K': {size: 1},
        'DST': {size: 1}, 'BEN': {size: 7},
    }
    var clock = 'Instant';
    var keepers = [];
    try {
        const location = useLocation();
        const homeInfo = location.state;
        leagueSize = homeInfo.leagueSize;
        queuePosition = homeInfo.queuePosition;
        leagueType = homeInfo.leagueType;
        positionSizes = homeInfo.positionSizes;
        clock = homeInfo.clock;
        keepers = homeInfo.keepers;
    } catch (error) {
        console.log('Props not found, using default values.');
    }

    const numPositionSizes = Object.keys(positionSizes).map(key => positionSizes[key].size);

    const totalPositionSize = helper.sum(numPositionSizes);
    const [queueArr, setQueueArr] = useState(helper.buildQueueArray(leagueSize, totalPositionSize));

    const [displayInfo, setDisplayInfo] = useState("Click \"Start\" to begin");

    const teams = new Teams(leagueSize, positionSizes);
    const [allTeams, setAllTeams] = useState(teams.initTeams());
    const [displayedTeam, setDisplayedTeam] = useState(queuePosition);

    const renderTeam = () => {
        return (
            <Box 
                style={styles.teamPlayerPaper}
                display="flex"
                flexDirection="column"
                minHeight="80vh"
                component={Paper}
                sx={{
                    width: isWideScreen ? '100%' : '100vw',
                    pb: isWideScreen ? 0 : '48px',
                    pt: '2px'
                }}
            >
                {Object.keys(allTeams[displayedTeam]).map((position) => {
                    return ((allTeams[displayedTeam][position]).map((player, index) => {
                        return (
                            <Box 
                                style={styles.teamPlayerContainer}
                                flexGrow={1}
                                width='100%'
                            >
                                <Typography 
                                    color='primary'
                                    key={position + '_' + player.name + '_' + index}
                                    style={{
                                        padding: 6,
                                        paddingBottom: isWideScreen ? 8 : 5,
                                        paddingTop: isWideScreen ? 8 : 6,
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    {position}: {player.name}
                                </Typography>
                                <Divider />
                            </Box>
                        )
                    })
                )})
                }
                <Box flexGrow={1} width='100%'>
                    <FormControl
                        sx={{width: '100%', zIndex: 0}}
                    >
                        <Select
                            value={displayedTeam}
                            displayEmpty
                            variant="standard"
                            sx={{
                                padding: 1,
                                fontSize: '0.9rem'
                            }}
                            onChange={(e) => setDisplayedTeam(parseInt(e.target.value))}
                        >
                            {Array.from({length: leagueSize}, (_, i) => i + 1).map((s) => {
                                    return (
                                        <MenuItem key={s} value={s}>Team {s}</MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </Box>
            </Box>
        )
    };

    // Init Players by league type
    const [allPlayers, setAllPlayers] = useState(playersObj[leagueType]);

    const renderPlayerCard = () => {
        return (
            <Box 
                style={styles.teamPlayerPaper}
                display="flex"
                flexDirection="column"
                minHeight="25vh"
                sx={{
                    width: isWideScreen ? '100%' : '100vw',
                    pb: isWideScreen ? 0 : '48px',
                    pt: '2px'
                }}
            >
                <Box
                    flexGrow={1}
                    p={2}
                >
                    <BsFillPersonFill size={80} />
                </Box>
            </Box>
        )
    };

    return (
        <Container maxWidth='100vw' style={styles.mainContainer}>
            <Box
                maxWidth="100%"
                display="flex"
                flexDirection="column"
                minHeight="20vh"
            >
                {/* Header */}
                <Box component={Paper} flexGrow={1} style={styles.header}>
                    <Typography 
                        variant="h4" 
                        fontWeight={700} 
                        color='primary' 
                        style={{width: '100%'}}
                        fontSize='1.5rem'
                    >
                        Minute Mock
                    </Typography>
                    <Container style={styles.headerOptions}>
                        <Link to="/mock/home/">
                            <IconButton color='primary'>
                                <AiFillHome size={22}/>
                            </IconButton>
                        </Link>
                        <IconButton color='primary'>
                            <AiFillPlayCircle size={22}/>
                        </IconButton>
                        <Chip color='primary' label="0:00" style={{fontSize: '0.8rem'}}></Chip>
                    </Container>
                </Box>
                {/* End Header */}
                {/* Draft Info Status */}
                <Box 
                    maxWidth="100vw"
                    style={styles.draftInfoContainer}
                    flexGrow={1}
                    minHeight='5vh'
                >
                    <Typography 
                        variant="h6" 
                        color='primary' 
                        fontWeight={500}
                        fontSize='0.9rem'
                    >
                        {displayInfo}
                    </Typography>
                </Box>
                {/* End Draft Info Status */}
                {/* Display Queue Position/Round */}
                <Box 
                    maxWidth="100vw" 
                    style={styles.queueContainer}
                    flexGrow={1}
                    maxHeight="5vh"
                >
                    {queueArr.map((x) => {
                        const isRound = ((typeof(x.queueVal) === 'string') && (x.queueVal.includes('Round')));
                        const isUserPosition = x.queueVal === queuePosition;
                        return (
                            <Chip 
                                color={isRound ? 'primary' : 'secondary'}
                                label={x.queueVal} 
                                style={styles.queueObject}
                                key={x.round + '_' + x.queueVal}
                                variant={isUserPosition ? "filled" : "outlined"}
                            >
                            </Chip>
                        )
                    })}
                </Box>
            </Box>
            {/* End Display Queue Position/Round */}
            <TabContext value={tabValue}>
            {isWideScreen ? (
                <Grid container spacing={0}>
                    <Grid item xs={4}>
                        {renderTeam()}
                    </Grid>
                    <Grid item xs={6}>
                        {renderPlayerCard()}
                    </Grid>
                </Grid>
            ) : (
                <Box>
                    <Box 
                        position='fixed' 
                        bottom={0}
                        left={0}
                        width='100%' 
                        component={Paper}
                        zIndex={1}
                    >
                        <Tabs 
                            value={tabValue} 
                            onChange={(event, value) => setTabValue(value)} 
                            variant='fullWidth'
                        >
                            <Tab label="Teams" value="Teams" />
                            <Tab label="Players" value="Players" />
                            <Tab label="Favorites" value="Favorites" />
                        </Tabs>
                    </Box>
                    <TabPanel value="Teams" style={styles.tabPanels}>
                        {renderTeam()}
                    </TabPanel>
                    <TabPanel value="Players" style={styles.tabPanels}>
                        {renderPlayerCard()}
                    </TabPanel>
                    <TabPanel value="Favorites" style={styles.tabPanels}>Content for Tab 3</TabPanel>
                </Box>
            )}
            </TabContext>
        </Container>
    )
};

const styles = {
    mainContainer: {
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 15,
        paddingRight: 0
    },
    headerOptions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        alignItems: 'center',
        gap: 2
    },
    draftInfoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    queueContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'no-wrap',
        justifyContent: 'start',
        alignItems: 'start',
        width: '100%',
        overflow: 'hidden',
        padding: 0
    },
    queueObject: {
        fontSize: 14, 
        borderRadius: 0,
        fontWeight: 600,
        marginRight: 5
    },
    teamPlayerPaper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'start'
    },
    teamPlayerContainer: {
        paddingTop: 2
    },
    tabPanels: {
        margin: 0,
        padding: 0
    }
}

export default Mock;