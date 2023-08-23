import playersStd from '../assets/jsonData_std.json';
import playersPpr from '../assets/jsonData_ppr.json';
import playersHalf from '../assets/jsonData_half.json';
import ding from '../assets/news-ting-6832.mp3';
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiFillHome, AiFillPlayCircle, AiFillStar, AiOutlineStar } from "react-icons/ai";
import { 
    Container, Paper, Grid, 
    Typography, Chip, Button, 
    IconButton, Divider, FormControl, 
    Select, MenuItem, Box, 
    useMediaQuery, Tabs, Tab
} from "@mui/material";
import { TabPanel, TabContext } from '@mui/lab';
import { DataGrid } from '@mui/x-data-grid';
import Helper from '../models/Helper';
import Teams from "../models/Teams";
import Computer from "../models/Computer";

const helper = new Helper();
const computer = new Computer();

const playersObj = {
    'Standard': JSON.parse(JSON.stringify(playersStd)),
    'PPR': JSON.parse(JSON.stringify(playersPpr)),
    'Half-PPR': JSON.parse(JSON.stringify(playersHalf))
};

// overallRanking, name, team, position, projections,
// lastSeasonPoints, positionRanking, flexRanking

const userTime = 30;
const computerTimeOptions = {
    'Instant': 0,
    'Fast': 2,
    'Medium': 5,
    'Slow': 10
};
const audio = new Audio(ding);
audio.loop = false;
audio.volume = 0.4;

function Mock() {

    const isWideScreen = useMediaQuery('(min-width: 850px)');
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
    const [simpleQueueArr, setSimpleQueueArr] = useState(queueArr.filter(x => typeof(x.queueVal) !== 'string').map(x => x.queueVal));

    const [displayInfo, setDisplayInfo] = useState("");

    // team
    const teams = new Teams(leagueSize, positionSizes);
    const [allTeams, setAllTeams] = useState(teams.initTeams());
    const [displayedTeam, setDisplayedTeam] = useState(queuePosition);

    const [roundsSelected, setRoundsSelected] = useState(teams.initRoundsSelected(totalPositionSize, keepers));

    const renderTeam = () => {
        return (
            <Box 
                display="flex"
                flexDirection="column"
                height={isWideScreen ? "80.2vh" : "calc(80vh - 60px)"}
                sx={{
                    overflow: isWideScreen ? 'auto' : 'hidden',
                    overflowX: 'hidden',
                    pb: isWideScreen ? 0 : 90,
                }}
            >
                {Object.keys(allTeams[displayedTeam]).map((position) => {
                    return ((allTeams[displayedTeam][position]).map((name, index) => {
                        return (
                            <Box 
                                flexGrow={1}
                                width='100%'
                                key={position + '_' + name + '_' + index}
                            >
                            <Box
                                display="flex"
                                flexDirection="row"
                                sx={{
                                    p: 1
                                }}
                            >
                                    <Typography 
                                        color='primary'
                                        fontWeight={600}
                                        fontSize="0.9rem"
                                        sx={{
                                            pr: 1
                                        }}
                                    >
                                        {position}: 
                                    </Typography>
                                    <Typography
                                        color="secondary"
                                        fontSize="0.9rem"
                                    >
                                        {name}
                                    </Typography>
                                </Box>
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
                            disableUnderline
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

    // table
    const [allPlayers, setAllPlayers] = useState(playersObj[leagueType]);
    const [selectedPlayer, setSelectedPlayer] = useState(allPlayers[0]);

    const renderPlayerCard = () => {
        return (
            <Box 
                style={styles.playerCardContainer}
                minHeight="15vh"
                minWidth={isWideScreen ? "100%" : "97vw"}
                sx={{
                    padding: 2
                }}
            >
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="center"
                    alignItems="start"
                >
                    <Box>
                        <Typography fontSize={20} color="primary" variant="h5" fontWeight={700}>{selectedPlayer.name}</Typography>
                        <Typography fontSize={14} fontWeight={600} color="secondary">{selectedPlayer.position}</Typography>
                        <Box 
                            display="flex" 
                            flexDirection="row" 
                            justifyContent="space-between"
                            width={135}
                            m={0}
                            p={0}
                        >
                            <Typography 
                                fontSize={14}
                                fontWeight={600}
                                color="primary" 
                                variant="p"
                            >
                                Projections: 
                            </Typography>
                            <Typography 
                                fontSize={14} 
                                color="secondary"  
                                variant="p"
                            >
                                {helper.round(selectedPlayer.projections)}
                            </Typography>
                        </Box>
                        <Box 
                            display="flex" 
                            flexDirection="row" 
                            justifyContent="space-between"
                            width={135}
                            m={0}
                            p={0}
                        >
                            <Typography 
                                fontSize={14}
                                fontWeight={600}
                                color="primary" 
                                variant="p"
                            >
                                2022 Points: 
                            </Typography>
                            <Typography 
                                fontSize={14} 
                                color="secondary"  
                                variant="p"
                            >
                                {selectedPlayer.lastSeasonPoints}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box  
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="end"
                >
                    <Box>
                        <IconButton 
                            color='secondary' 
                            onClick={() => setFavorites([...favorites, selectedPlayer])}
                            disabled={(favorites.filter(x => x.name === selectedPlayer.name).length === 1)}
                        >
                            {(favorites.filter(x => x.name === selectedPlayer.name).length === 0) ? 
                                <AiOutlineStar /> :
                                <AiFillStar />
                            }
                        </IconButton>
                        <Button 
                            variant="outlined" 
                            color="secondary"
                            onClick={handleUserDraft}
                            disabled={(currDrafter !== queuePosition)}
                        >
                            Draft
                        </Button>
                    </Box>
                </Box>
            </Box>
        )
    };

    // DATA GRID
    const columns = [
        { field: 'id', headerName: 'Rank', flex: 1, minWidth: 100 },
        { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
        { field: 'position', headerName: 'Position', flex: 1, minWidth: 120 },
        { field: 'team', headerName: 'Team' },
        { field: 'projections', headerName: 'Projections' },
        { field: 'lastSeasonPoints', headerName: '2022 Points' }
    ];

    const renderTable = () => {
        return (
            <Box 
                width='100%'
                maxWidth="100vw"
                height={isWideScreen ? "65vh" : "calc(65vh - 65px)"}
            >
                <DataGrid
                    rows={allPlayers.map((x, index) => {
                        return { 
                            id: x.overallRanking, name: x.name, position: x.position,  
                            team: x.team, projections: helper.round(x.projections),
                            lastSeasonPoints: x.lastSeasonPoints
                        }
                    })}
                    columns={columns}
                    onRowSelectionModelChange={(playerRank) => {
                        setSelectedPlayer(allPlayers.find(x => x.overallRanking === playerRank[0]))
                    }}
                    // disableColumnFilter
                    // disableColumnSelector
                    // disableDensitySelector
                    // slots={{ toolbar: GridToolbar }}
                    // slotProps={{
                    //     toolbar: {
                    //         showQuickFilter: true
                    //     }
                    // }}
                    slotProps={{
                        filterPanel: {
                            sx: {
                                maxWidth: "100vw" 
                            }
                        }
                    }}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 20 }
                        }
                    }}
                    pageSizeOptions={[20]}
                    density='compact'
                    style={{
                        borderRadius: 0
                    }}
                />
            </Box>
        )
    };

    // favorites
    const [favorites, setFavorites] = useState([]);

    const renderFavorites = () => {
        return (
            <Box 
                // style={}
                display="flex"
                flexDirection="column"
                minWidth={isWideScreen ? "100%" : "100vw"}
                height={isWideScreen ? "80vh" : "65vh"}
                overflow="auto"
                sx={{
                    pb: isWideScreen ? 0 : 6
                }}
            >
                <Typography 
                    variant="h6" 
                    color="secondary"
                    sx={{
                        p: 1,
                        pl: 2.25,
                        borderRadius: 0,
                        width: '100%',
                        zIndex: 1
                    }}
                    component={Paper}
                >
                    Favorites
                </Typography>
                <Divider flexItem />
                <Box 
                    display="flex"
                    flexDirection="column"
                    flexGrow={1}
                >
                    {favorites.map(player => {
                        return (
                            <Box 
                                    // style={}
                                    width='100%'
                                    key={player.name}
                                >
                                    <Chip
                                        variant="outlined"
                                        color='primary'
                                        label={player.name}
                                        onClick={() => setSelectedPlayer(player)}
                                        onDelete={() => setFavorites(favorites.filter(x => x.name !== player.name))}
                                        style={{
                                            padding: 6,
                                            paddingBottom: isWideScreen ? 8 : 5,
                                            paddingTop: isWideScreen ? 8 : 6,
                                            fontSize: '0.9rem',
                                            border: 0,
                                            borderRadius: 0,
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                    </Chip>
                                    <Divider />
                                </Box>
                        )
                    })}
                </Box>  
            </Box>
        )
    };

    // DRAFT LOGIC
    const [allNeeds, setAllNeeds] = useState(teams.initNeeds());

    const [startClicked, setStartClicked] = useState(false);
    const [draftEnd, setDraftEnd] = useState(false);

    const [computerTime, setComputerTime] = useState(computerTimeOptions[clock]);
    const [timerNum, setTimerNum] = useState((queuePosition === 1) ? userTime : computerTime);

    const [currDrafter, setCurrDrafter] = useState(1);
    const [round, setRound] = useState(1);
    const [queueIndex, setQueueIndex] = useState(0);

    // GAME FUNCTIONS
    const handleKeepers = () => {
        let team = allTeams[queuePosition];
        let needs = allNeeds[queuePosition];
        for (let k of keepers) {
            if (allPlayers.map(x => x.name).includes(k.name)) {
                let player = allPlayers.find(x => x.name === k.name);
                teams.addPlayer(team, player);
                setAllPlayers(allPlayers.filter(x => x.name !== player.name));
                setFavorites(favorites.filter(x => x.name !== player.name));
                teams.updateNeeds(team, needs, player.position, round);
            };
        }
    };

    const handleStart = () => {
        setStartClicked(true);
        setDisplayInfo("Draft started.");
        if (queuePosition === 1) {
            setDisplayInfo(displayInfo + "You're on the clock.");
        }
    };

    const handleShiftQueue = () => {
        let currIndex = queueArr.findIndex(x => x.queueVal === currDrafter && x.round === round);
        setQueueArr(queueArr.filter((x, index) => index !== currIndex));
        let temp = queueArr;
        if (currDrafter === simpleQueueArr[queueIndex + 1]) {
            setRound(round + 1);
            temp.shift();
            temp.shift();
            setQueueArr(temp);
        };
    };

    const handleComputerDraft = () => {
        let needs = allNeeds[currDrafter];
        let player = computer.getPlayer(needs, currDrafter, round, allPlayers);
        let team = allTeams[currDrafter];
        teams.addPlayer(team, player);
        setAllPlayers(allPlayers.filter(x => x.name !== player.name));
        setFavorites(favorites.filter(x => x.name !== player.name));
        teams.updateNeeds(team, needs, player.position, round);
        var displayString = "Team " + currDrafter.toString() + " selects " + player.position + " " + player.name + ". ";
        if (simpleQueueArr[queueIndex + 1] !== queuePosition) {
            setDisplayInfo(displayString);
        } else {
            setDisplayInfo(displayString + "You're on the clock.");
        };
        if (simpleQueueArr[queueIndex] === queuePosition) {
            var userDisplayString = "You selected " + player.position + " " + player.name + ". ";
            setDisplayInfo(userDisplayString);
        };
    };

    const handleUserDraft = () => {
        let team = allTeams[queuePosition];
        let needs = allNeeds[queuePosition];
        let added = teams.addPlayer(team, selectedPlayer);
        if (added) {
            setAllPlayers(allPlayers.filter(x => x.name !== selectedPlayer.name));
            setFavorites(favorites.filter(x => x.name !== selectedPlayer.name));
            teams.updateNeeds(team, needs, selectedPlayer.position, round);
            var displayString = "You selected " + selectedPlayer.position + " " + selectedPlayer.name + ". ";
            setDisplayInfo(displayString);
            setTimerNum(-1);
        } else {
            var tempInfo = displayInfo;
            setDisplayInfo("Position already filled.");
            setTimeout(() => {
                setDisplayInfo(tempInfo);
            }, 500);
        };
    };
    
    const handleAutoUserDraft = () => {
        let team = allTeams[queuePosition];
        let needs = allNeeds[queuePosition];
        for (let player of favorites) {
            let added = teams.addPlayer(team, player);
            if (added) {
                setAllPlayers(allPlayers.filter(x => x.name !== player.name));
                setFavorites(favorites.filter(x => x.name !== player.name));
                teams.updateNeeds(team, needs, player.position, round);
                var displayString = "You auto-selected " + player.position + " " + player.name + ". ";
                setDisplayInfo(displayString);
                setTimerNum(-1);
                return;
            }
        };
        handleComputerDraft();
    };

    // updates currDrafter, round, queue, timer
    const nextDrafter = () => {
        setCurrDrafter(simpleQueueArr[queueIndex + 1]);
        setQueueIndex(queueIndex + 1);
        if ((queueIndex + 1) !== simpleQueueArr.length) {
            handleShiftQueue(currDrafter, round);
            if (simpleQueueArr[queueIndex] === simpleQueueArr[queueIndex + 1]) {
                setRound(round + 1);
            }
            if ((simpleQueueArr[queueIndex + 1]) !== queuePosition) {
                setTimerNum(computerTime);
            } else {
                audio.play();
                setTimerNum(userTime);
            }
        } else { // draft end
            setDraftEnd(true);
            queueArr.shift();
            queueArr.shift();
        }
    };

    // ONLOAD - add keepers
    useEffect(() => {
        handleKeepers();
    }, [])

    // TIMER
    useEffect(() => {
        let timer = null;
        if (startClicked) {
            timer = setInterval(() => {
                setTimerNum(timerNum - 1);
            }, 1000);
        };
        return () => {
            clearInterval(timer);
        };
    });

    // COMPUTER GAME LOOP
    useEffect(() => {
        if (startClicked && !draftEnd) {
            if (timerNum === -1) {
                if (currDrafter !== queuePosition) {
                    handleComputerDraft();
                }
                nextDrafter();
            }
        }
    });

    // USER GAME LOOP
    useEffect(() => {
        if (startClicked && !draftEnd) {
            // if (currDrafter === queuePosition && keepers.map(x => x.round).includes(round)) {
            //     if (currDrafter === queuePosition && timerNum === 0) {
            //         handleAutoUserDraft();
            //         nextDrafter();
            //     }
            // }
            if (currDrafter === queuePosition) {
                if (!keepers.map(x => x.round).includes(round)) {
                    let k = keepers.find(x => x.round === round);
                    setTimeout(() => {
                        setDisplayInfo(`Keeper selected: ${k.name}.`);
                    }, 500);
                    nextDrafter();
                };
                if (timerNum === 0) {
                    handleAutoUserDraft();
                    nextDrafter();
                }
            }
        }
    });

    // UPDATE selectedPlayer
    useEffect(() => {
        // if (round > 10) {
        //     console.log(`Round: ${round}`);
        //     console.log(allNeeds)
        // }
        if (!allPlayers.map(x => x.name).includes(selectedPlayer.name)) {
            setSelectedPlayer(allPlayers[0]);
        };
    }, [allPlayers]);

    return (
        <Container 
            maxWidth={false} 
            style={styles.mainContainer}
        >
            <Box
                maxWidth="100%"
                display="flex"
                flexDirection="column"
                minHeight="19.7vh"
            >
                {/* Header */}
                <Box 
                    component={Paper} 
                    flexGrow={1} 
                    style={styles.header}
                    minWidth="99vw"
                >
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
                        <IconButton onClick={handleStart} color='primary'>
                            <AiFillPlayCircle size={22}/>
                        </IconButton>
                        <Chip 
                            color='primary' 
                            label={timerNum !== -1 ? helper.convertTime(timerNum) : '0:00'} 
                            style={{fontSize: '0.8rem'}}
                        >
                        </Chip>
                    </Container>
                </Box>
                {/* End Header */}
                {/* Draft Info Status */}
                <Box 
                    maxWidth="100%"
                    style={styles.draftInfoContainer}
                    flexGrow={1}
                    minHeight='5vh'
                >
                    {displayInfo.length > 0 ?
                        <Typography 
                            variant="h6" 
                            color='primary' 
                            fontWeight={500}
                            fontSize='0.9rem'
                        >
                            {displayInfo}
                        </Typography>
                        :
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="center"
                        >
                            <Typography 
                                variant="h6" 
                                color='primary' 
                                fontWeight={500}
                                fontSize='0.9rem'
                            >
                                Click 
                            </Typography>
                            <AiFillPlayCircle color="#2196f3" style={{marginLeft: 4, marginRight: 4}} />
                            <Typography 
                                variant="h6" 
                                color='primary' 
                                fontWeight={500}
                                fontSize='0.9rem'
                            >
                                to begin. 
                            </Typography>
                        </Box>  
                    }
                </Box>
                {/* End Draft Info Status */}
                {/* Display Queue Position/Round */}
                <Box 
                    maxWidth="100%" 
                    style={styles.queueContainer}
                    flexGrow={1}
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
                <Grid container spacing={0} wrap="nowrap">
                    <Grid item xs={3}>
                        <Divider flexItem />
                        {renderTeam()}
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item xs={6}>
                        <Divider flexItem />
                        {renderPlayerCard()}
                        <Divider flexItem />
                        {renderTable()}
                    </Grid>
                    <Divider orientation="vertical" flexItem />
                    <Grid item xs={3}>
                        <Divider flexItem />
                        {renderFavorites()}
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
                        {renderPlayerCard()}
                        <Divider flexItem />
                        {renderTeam()}
                    </TabPanel>
                    <TabPanel value="Players" style={styles.tabPanels}>
                        {renderPlayerCard()}
                        <Divider flexItem />
                        {renderTable()}
                    </TabPanel>
                    <TabPanel value="Favorites" style={styles.tabPanels}>
                        {renderPlayerCard()}
                        <Divider flexItem />
                        {renderFavorites()}
                    </TabPanel>
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
        paddingRight: 0,
        borderRadius: 0
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
    },
    playerCardContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
}

export default Mock;