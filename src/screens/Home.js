import React, { Component, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useState } from 'react';
import playersStd from '../assets/jsonData_std.json';
import playersPpr from '../assets/jsonData_ppr.json';
import playersHalf from '../assets/jsonData_half.json';
import { AiFillInfoCircle, AiOutlineClose, AiFillPlusCircle } from "react-icons/ai";
import Modal from 'react-modal';
import { 
    Container, Typography, Paper, 
    Button, IconButton, InputLabel, 
    MenuItem, FormControl, Divider,
    Autocomplete, TextField, List,
    Chip
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const sizes = [8, 10, 12, 14];
const types = ['Standard', 'PPR', 'Half-PPR'];
const times = ['Instant', 'Fast', 'Medium', 'Slow'];
const playerData = {
    'Standard': JSON.parse(JSON.stringify(playersStd)),
    'PPR': JSON.parse(JSON.stringify(playersPpr)),
    'Half-PPR': JSON.parse(JSON.stringify(playersHalf))
}

function Home() {

    const [infoModalIsOpen, setInfoModalIsOpen] = useState(false);
    const [keeperModalIsOpen, setKeeperModalIsOpen] = useState(false);
    const [keeperRoundModalIsOpen, setKeeperRoundModalIsOpen] = useState(false);

    const [size, setSize] = useState(8);
    const [queue, setQueue] = useState(1);
    const [type, setType] = useState('Standard');
    const [clock, setClock] = useState('Instant');

    const [qbSize, setQbSize] = useState(1);
    const [rbSize, setRbSize] = useState(2);
    const [wrSize, setWrSize] = useState(2);
    const [teSize, setTeSize] = useState(1);
    const [flexSize, setFlexSize] = useState(1);
    const [kSize, setKSize] = useState(1);
    const [dstSize, setDstSize] = useState(1);
    const players = {
        'QB': {size: 2, variable: qbSize, setFunc: setQbSize},
        'RB': {size: 4, variable: rbSize, setFunc: setRbSize},
        'WR': {size: 4, variable: wrSize, setFunc: setWrSize},
        'TE': {size: 2, variable: teSize, setFunc: setTeSize},
        'FLEX': {size: 4, variable: flexSize, setFunc: setFlexSize},
        'K': {size: 2, variable: kSize, setFunc: setKSize},
        'DST': {size: 2, variable: dstSize, setFunc: setDstSize}
    }
    const [keeperSearchValue, setKeeperSearchValue] = useState('');
    const [keepers, setKeepers] = useState([]);

    // setSize and update queue position if greater than size
    const setSizeAndQueue = (size) => {
        setSize(size);
        if (queue > size) {
            setQueue(size);
        };
    };

    // render all options except players
    const renderOption = (title, arr, state_var, setFunc) => {
        return (
            <Container
                style={styles.optionsContainer}
            >
                <Typography variant='h6' fontWeight={600} color="primary">{title}</Typography>
                <Container
                    style={styles.innerOptionsContainer}
                >
                    {arr.map((x) => {
                        return (
                            <Button 
                                variant={x !== state_var ? 'outlined' : 'contained'}
                                onClick={() => setFunc(x)}
                                key={title + " " + x}
                            >
                                {x}
                            </Button>
                        )
                    })}
                </Container>
            </Container>
        )
    };

    // Init Players by league type
    const [allPlayers, setAllPlayers] = useState(() => {
        return playerData[type];
    });

    // set type and update playerData
    const setTypeAndPlayers = (type) => {
        setType(type);
        setAllPlayers(playerData[type]);
    }

    console.log(keeperSearchValue);
    console.log(keepers);

    return (
        <Container 
            maxWidth="100vw" 
            style={styles.mainContainer}
        >
            <Paper 
                elevation={10}
                sx={styles.paperOptions}
            >
                <Typography variant='h4' fontWeight={700} color="primary">Minute Mock</Typography>
                <IconButton color='primary' onClick={() => setInfoModalIsOpen(true)}>
                    <AiFillInfoCircle size={20}/>
                </IconButton>
                <Modal
                    isOpen={infoModalIsOpen}
                    onRequestClose={() => setInfoModalIsOpen(false)}
                    style={styles.modalStyle}
                    appElement={document.body}
                >
                    <Paper
                        style={styles.infoModalPaper}
                    >
                        <IconButton style={{float: 'right', top: 0}} onClick={() => setInfoModalIsOpen(false)}>
                            <AiOutlineClose size={16}/>
                        </IconButton>
                        <br></br>
                        <br></br>
                        <Typography variant='p' color="primary">
                            Minute Mock is an NFL fantasy football mock draft simulator which can be
                            very quickly without having to rely on other users and is fully customizable.
                            To begin just select select your specifications below  and then click submit. Computer Clock selection 
                            determines how fast the comptuer will make its selections. 
                            <br></br><b>Instant:</b> 0s, <b>Fast:</b> 2s, <b>Medium:</b> 5s, <b>Slow:</b> 10s<br></br>
                            <b>User Time Always:</b> 30s<br></br>
                            Once in the draft page, you can then add players to your favorites which will be 
                            autoselected if your time expires and your team has room for that position. Finally, 
                            click start in the upper right to begin the draft.
                        </Typography>
                    </Paper>
                </Modal>
                {renderOption('League Size', sizes, size, setSizeAndQueue)}
                {renderOption('Draft Position', Array.from({length: size}, (_, i) => i + 1), queue, setQueue)}
                {renderOption('League Type', types, type, setTypeAndPlayers)}
                {/* Render player (select sizes for each position) */}
                <Container
                    style={styles.optionsContainer}
                >
                    <Typography variant='h6' fontWeight={600} color="primary">Players</Typography>
                    <Container style={styles.innerOptionsContainer}>
                        {Object.keys(players).map((x) => {
                            return (
                                <FormControl
                                    sx={{m: 1}}
                                    key={x}
                                >
                                    <InputLabel key={x} style={{zIndex: 0}}>{x}</InputLabel>
                                    <Select
                                        value={players[x].variable}
                                        label={x}
                                        key={x + '_' + players[x].size}
                                        onChange={(e) => players[x].setFunc(parseInt(e.target.value))}
                                    >
                                        {Array.from({length: players[x].size}, (_, i) => i + 1).map((s) => {
                                            return (
                                                <MenuItem key={x + '_' + s} value={s}>{s}</MenuItem>
                                            )
                                        })
                                        }
                                    </Select>
                                </FormControl>
                            )
                        })}
                    </Container>
                </Container>
                {renderOption('Clock Speed', times, clock, setClock)}
                <Container
                    style={styles.optionsContainer}
                >
                    <Typography variant='h6' fontWeight={600} color="primary" style={{padding: 10}}>Keepers</Typography>
                    <Button variant='outlined' onClick={() => setKeeperModalIsOpen(true)}>Add Keepers</Button>
                </Container>
                <Modal
                    isOpen={keeperModalIsOpen}
                    onRequestClose={() => setKeeperModalIsOpen(false)}
                    style={styles.modalStyle}
                    appElement={document.body}
                >
                    <Paper
                        style={styles.keeperModalPaper}
                    >
                        <IconButton style={{float: 'right', top: 0}} onClick={() => setKeeperModalIsOpen(false)}>
                            <AiOutlineClose size={16}/>
                        </IconButton>
                        <br></br>
                        <br></br>
                        <Container maxWidth={false} style={styles.keeperModalSearchContainer}>
                            <Autocomplete
                                disableClearable
                                options={allPlayers.sort((a, b) => b.position.localeCompare(a.position))}
                                groupBy={(option) => option.position}
                                getOptionLabel={(option) => option.name}
                                renderInput={(params) => <TextField {...params} label='Players'/>}
                                ListboxProps={
                                    {
                                        style: {
                                            maxHeight: 200
                                        }
                                    }
                                }
                                sx={{width: '100%'}}
                                onChange={(event, newVal) => setKeeperSearchValue(newVal.name)}
                            />
                            <IconButton color='primary' onClick={() => setKeeperRoundModalIsOpen(true)}>
                                <AiFillPlusCircle size={34} />
                            </IconButton>
                        </Container>
                        <Container maxWidth={false} style={styles.keepersContainer}>
                            {keepers.map((x) => {
                                return (
                                    <Chip
                                        label={x}
                                        color='primary'
                                    />
                                )
                            })}
                        </Container>
                    </Paper>
                </Modal>
                <Divider />
                <Link
                    to='/mock/content'
                    state={{
                        leagueSize: size,
                        queuePosition: queue,
                        leagueType: type,
                        playersSize: Object.keys(players).map(key => players[key].variable),
                        clock: clock
                    }}
                >
                    <Button 
                        type='submit' 
                        variant='contained' 
                        color='secondary'
                        style={{
                            marginTop: 20
                        }}
                    >
                        Submit
                    </Button>
                </Link>
            </Paper>
        </Container>
    )
}

const styles = {
    mainContainer: {
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '5%',
        paddingBottom: '5%'
    },
    paperOptions: {
        width: '80%', 
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 1,
        padding: '5%'
    },
    modalStyle: {
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: 'fit-content',
            boxShadow: 24,
            padding: 0,
            margin: 0,
            border: 0
        },
        overlay: {
            background: 'rgba(0, 0, 0, 0.7)'
        }
    },
    infoModalPaper: {
        width: '100%',
        padding: 20,
        paddingBottom: 40,
        textAlign: 'center'
    },
    keeperModalPaper: {
        width: '100%',
        height: 400,
        padding: 20,
        textAlign: 'center'
    },
    optionsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    innerOptionsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 5,
        padding: 10
    },
    keeperModalSearchContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    keepersContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    }
};

export default Home;