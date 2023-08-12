import React, { Component, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useState } from 'react';
import './Home.css';
import HomeButton from '../components/HomeButton';
import QueueButton from '../components/QueueButton';
import cx from 'classnames';
import PlayerInput from '../components/PlayerInput';
import { AiFillInfoCircle, AiOutlineClose } from "react-icons/ai";
import Modal from 'react-modal';
import { Container, Typography, Paper, Button, IconButton, InputLabel, MenuItem, FormControl } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const sizes = [8, 10, 12, 14];
const types = ['Standard', 'PPR', 'Half-PPR'];
const times = ['Instant', 'Fast', 'Medium', 'Slow'];

function Home() {

    const [infoModalIsOpen, setInfoModalIsOpen] = useState(false);

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
                        style={styles.modalPaper}
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
                {renderOption('League Type', types, type, setType)}
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
                                    <InputLabel key={x}>{x}</InputLabel>
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
        //         <div className='section-container submit'>
        //             <Link 
        //                 to="/content"
        //                 state={{
        //                     leagueSize: size,
        //                     queuePosition: queue,
        //                     leagueType: type,
        //                     playersSize: [qbSize, rbSize, wrSize, teSize, flexSize, kSize, dstSize, 7],
        //                     clock: clock
        //                 }}
        //             >
        //                 <input 
        //                     className="home-button submit" 
        //                     type='submit' 
        //                     value='Submit'>
        //                 </input>
        //             </Link>
        //         </div>
        //     </div>
        // </div>
    )
}

const styles = {
    mainContainer: {
        padding: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '5%'
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
            background: 'rgba(255, 255, 255, 0.4)'
        }
    },
    modalPaper: {
        width: '100%',
        padding: 20,
        paddingBottom: 40,
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
    select: {
        borderColor: 'red'
    }
};

export default Home;