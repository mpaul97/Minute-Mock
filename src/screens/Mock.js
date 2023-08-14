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
import { Container, Paper, Grid, Typography, Chip, Button, IconButton } from "@mui/material";
import { blue, amber } from "@mui/material/colors";
import Helper from '../models/Helper.js';

const helper = new Helper();

function Mock() {

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

    return (
        <Container maxWidth='100vw' style={styles.mainContainer}>
            {/* Header */}
            <Paper style={styles.header}>
                <Typography variant="h3" fontWeight={700} color='primary' style={{width: '100%'}}>Minute Mock</Typography>
                <Container style={styles.headerOptions}>
                    <Link to="/mock/home/">
                        <IconButton color='primary'>
                            <AiFillHome size={24}/>
                        </IconButton>
                    </Link>
                    <IconButton color='primary'>
                        <AiFillPlayCircle size={24}/>
                    </IconButton>
                    <Chip color='primary' label="0:00" style={{fontSize: 16}}></Chip>
                </Container>
            </Paper>
            {/* End Header */}
            {/* Draft Info Status */}
            <Container maxWidth={false} style={styles.draftInfoContainer}>
                <Typography variant="h6" color='primary' fontWeight={500}>{displayInfo}</Typography>
            </Container>
            {/* End Draft Info Status */}
            {/* Display Queue Position/Round */}
            <Container maxWidth={false} style={styles.queueContainer}>
                {queueArr.map((x) => {
                    const isRound = ((typeof(x.queueVal) === 'string') && (x.queueVal.includes('Round')));
                    const isUserPosition = x.queueVal === queuePosition;
                    return (
                        <Chip 
                            color={isRound ? 'primary' : 'secondary'}
                            label={x.queueVal} 
                            style={
                                isRound ? styles.roundQueueObject : 
                                isUserPosition ? styles.userQueueObject :
                                styles.queueObject
                            }
                            key={x.round + '_' + x.queueVal}
                            variant={isUserPosition ? "filled" : "outlined"}
                        >
                        </Chip>
                    )
                })}
            </Container>
            {/* End Display Queue Position/Round */}
            <Grid container spacing={0}>
                <Grid item xs={2}>
                    <Paper></Paper>
                </Grid>
            </Grid>
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
        width: '100%',
        padding: 15,
        paddingRight: 0
    },
    headerOptions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'end',
        alignItems: 'center',
        gap: 5
    },
    draftInfoContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
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
        fontSize: 16, 
        borderRadius: 0,
        padding: 5,
        paddingTop: 20,
        paddingBottom: 20,
        fontWeight: 600,
        marginRight: 5
    },
    roundQueueObject: {
        fontSize: 16, 
        borderRadius: 0,
        padding: 5,
        paddingTop: 20,
        paddingBottom: 20,
        fontWeight: 700,
        marginRight: 5
    },
    userQueueObject: {
        fontSize: 16, 
        borderRadius: 0,
        border: '1px solid #ffc400',
        padding: 5,
        paddingTop: 20,
        paddingBottom: 20,
        fontWeight: 700,
        marginRight: 5
    }
}

export default Mock;