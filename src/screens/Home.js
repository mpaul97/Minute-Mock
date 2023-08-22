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
    Chip, Box,
} from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Helper from '../models/Helper';
import Keeper from '../models/Keeper';

const sizes = [8, 10, 12, 14];
const types = ['Standard', 'PPR', 'Half-PPR'];
const times = ['Instant', 'Fast', 'Medium', 'Slow'];
const playerData = {
    'Standard': JSON.parse(JSON.stringify(playersStd)),
    'PPR': JSON.parse(JSON.stringify(playersPpr)),
    'Half-PPR': JSON.parse(JSON.stringify(playersHalf))
}
const helper = new Helper();

function Home() {

    const [infoModalIsOpen, setInfoModalIsOpen] = useState(false);
    const [keeperModalIsOpen, setKeeperModalIsOpen] = useState(false);

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
    const [benchSize, setBenchSize] = useState(7);
    const players = {
        'QB': {size: 2, variable: qbSize, setFunc: setQbSize},
        'RB': {size: 4, variable: rbSize, setFunc: setRbSize},
        'WR': {size: 4, variable: wrSize, setFunc: setWrSize},
        'TE': {size: 2, variable: teSize, setFunc: setTeSize},
        'FLEX': {size: 4, variable: flexSize, setFunc: setFlexSize},
        'K': {size: 2, variable: kSize, setFunc: setKSize},
        'DST': {size: 2, variable: dstSize, setFunc: setDstSize},
        'BEN': {size: 10, variable: benchSize, setFunc: setBenchSize},
    };

    const [keeperSearchValue, setKeeperSearchValue] = useState(null);
    const [keepers, setKeepers] = useState([]);
    const [keeperRound, setKeeperRound] = useState(1);
    const [keeperAddClicked, setKeeperAddClicked] = useState(false);
    const [keeperErrorMessage, setKeeperErrorMessage] = useState('Player already added.');

    const [totalRounds, setTotalRounds] = useState(helper.sum(Object.keys(players).map(key => players[key].variable)))

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
                <Typography variant='h6' fontWeight={600} color="secondary">{title}</Typography>
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
    const [allPlayers, setAllPlayers] = useState(playerData[type]);

    // set type and update playerData
    const setTypeAndPlayers = (inputType) => {
        setType(inputType);
        setAllPlayers(playerData[type]);
    }

    // delete keeper chip
    const handleKeeperDelete = (name) => {
        setKeepers(keepers.filter(x => x !== name));
    }

    // close keeper modal, reset keeper add clicked, and clear keeper search value
    const onKeeperCloseModal = () => {
        setKeeperModalIsOpen(false);
        setKeeperAddClicked(false);
        setKeeperSearchValue(null);
    }

    // get position sizes to dict object
    const getPositionSizes = () => {
        const obj = {};
        Object.keys(players).map(key => {
            obj[key] = {size: players[key].variable}
        });
        return obj;
    }

    // update number of total rounds
    useEffect(() => {
        setTotalRounds(helper.sum(Object.keys(players).map(key => players[key].variable)));
    }, [players])

    return (
        <Container 
            maxWidth="100vw" 
            style={styles.mainContainer}
        >
            <Box 
                sx={styles.paperOptions}
            >
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    width="100%"
                    p={2}
                    component={Paper}
                >
                    <Typography variant='h4' fontSize='1.7rem' fontWeight={700} color="primary">Minute Mock</Typography>
                    <IconButton color='primary' onClick={() => setInfoModalIsOpen(true)}>
                        <AiFillInfoCircle size={20}/>
                    </IconButton>
                </Box>  
                {/* Info Modal */}
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
                {/* End Info Modal */}
                {/* Main Options */}
                {renderOption('League Size', sizes, size, setSizeAndQueue)}
                <Divider flexItem/>
                {renderOption('Draft Position', Array.from({length: size}, (_, i) => i + 1), queue, setQueue)}
                <Divider flexItem/>
                {renderOption('League Type', types, type, setTypeAndPlayers)}
                <Divider flexItem/>
                {/* End Main Options */}
                {/* Render player (select sizes for each position) */}
                <Container
                    style={styles.optionsContainer}
                >
                    <Typography variant='h6' fontWeight={600} color="secondary">Players</Typography>
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
                <Divider flexItem/>
                {/* End Render Players */}
                {renderOption('Clock Speed', times, clock, setClock)}
                <Divider flexItem/>
                {/* Keepers */}
                <Container
                    style={styles.optionsContainer}
                >
                    <Typography variant='h6' fontWeight={600} color="secondary" style={{padding: 10}}>Keepers</Typography>
                    <Button 
                        variant='outlined' 
                        onClick={() => setKeeperModalIsOpen(true)}
                        sx={{mb: 1}}
                    >
                        Add Keepers
                    </Button>
                </Container>
                {/* End Keepers */}
                {/* Keepers Modal */}
                <Modal
                    id="keeper-modal"
                    isOpen={keeperModalIsOpen}
                    onRequestClose={onKeeperCloseModal}
                    style={styles.modalStyle}
                    appElement={document.body}
                >
                    <Paper
                        style={styles.keeperModalPaper}
                    >
                        <IconButton 
                            style={{float: 'right', top: 0}} 
                            onClick={onKeeperCloseModal}
                        >
                            <AiOutlineClose size={16} />
                        </IconButton>
                        <br></br>
                        <br></br>
                        {/* Keeper Search Container/Form */}
                        <Container maxWidth={false} style={styles.keeperModalSearchContainer}>
                            <FormControl style={styles.keeperForm}>
                                <Autocomplete
                                    disableClearable
                                    required
                                    options={allPlayers.sort((a, b) => b.position.localeCompare(a.position))}
                                    groupBy={(option) => option.position}
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => 
                                        <TextField 
                                            {...params} 
                                            label='Players'
                                        />
                                    }
                                    ListboxProps={
                                        {
                                            style: {
                                                maxHeight: 200
                                            }
                                        }
                                    }
                                    sx={{width: '50%'}}
                                    onChange={(event, newVal) => setKeeperSearchValue(newVal.name)}
                                />
                                <FormControl>
                                    <InputLabel style={{zIndex: 0}}>Round</InputLabel>
                                    <Select
                                        required
                                        value={keeperRound}
                                        label="Round"
                                        onChange={(e) => setKeeperRound(parseInt(e.target.value))}
                                        sx={{width: 70}}
                                    >
                                        {Array.from({length: totalRounds}, (_, i) => i + 1).map((s) => {
                                                return (
                                                    <MenuItem key={s} value={s}>{s}</MenuItem>
                                                )
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <IconButton 
                                    color='primary' 
                                    type='submit'
                                    onClick={() => {
                                        if (keeperSearchValue) {
                                            if (keepers.filter(x => x.name === keeperSearchValue).length === 0) {
                                                setKeepers([...keepers, new Keeper(keeperSearchValue, keeperRound)])
                                                setKeeperAddClicked(false);
                                            } else {
                                                setKeeperErrorMessage('Player already added.')
                                                setKeeperAddClicked(true);
                                            }
                                        } else {
                                            setKeeperErrorMessage('Player field is empty.')
                                            setKeeperAddClicked(true);
                                        }
                                    }}
                                >
                                    <AiFillPlusCircle size={34} />
                                </IconButton>
                            </FormControl>
                        </Container>
                        <Typography color='error' sx={{p: 1}}>{keeperAddClicked ? keeperErrorMessage : ''}</Typography>
                        {/* End Keeper Search Container/Form */}
                        {/* Keepers Chip List */}
                        <Container maxWidth={false} style={styles.keepersContainer}>
                            {keepers.map((x) => {
                                return (
                                    <Chip
                                        label={x.name + ' | Round ' + x.round}
                                        color='primary'
                                        onDelete={() => handleKeeperDelete(x)}
                                        key={x.name}
                                    />
                                )
                            })}
                        </Container>
                        {/* End Keepers Chip List */}
                        <Button variant='outlined' color='primary' onClick={onKeeperCloseModal}>Done</Button>
                    </Paper>
                </Modal>
                {/* End Keepers Modal */}
                <Divider flexItem/>
                {/* Submit to Mock */}
                <Link
                    to='/mock/content'
                    state={{
                        leagueSize: size,
                        queuePosition: queue,
                        leagueType: type,
                        positionSizes: getPositionSizes(),
                        clock: clock,
                        keepers: keepers
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
                {/* End Submit */}
            </Box>
        </Container>
    )
}

const styles = {
    mainContainer: {
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 1,
        paddingBottom: 20
    },
    paperOptions: {
        width: '100%', 
        height: 'fit-content',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 0
    },
    modalStyle: {
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            height: 'fit-content',
            boxShadow: 36,
            padding: 0,
            margin: 0,
            border: 0,
            background: 'transparent'
        },
        overlay: {
            background: 'rgba(0, 0, 0, 0.8)'
        }
    },
    infoModalPaper: {
        width: '100%',
        padding: 20,
        paddingBottom: 60,
        textAlign: 'center'
    },
    optionsContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10
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
    keeperModalPaper: {
        width: '100%',
        height: 'fit-content',
        padding: 20,
        textAlign: 'center'
    },
    keeperForm: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
    },
    keepersContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 10,
        paddingBottom: 20
    },
};

export default Home;