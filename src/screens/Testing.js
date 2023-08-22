import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Collapse, Tab, Tabs, Paper } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TabPanel, TabContext } from '@mui/lab';
import Helper from '../models/Helper';

const data = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']; // Replace with your data

const helper = new Helper();

const Testing = () => {
    const isWideScreen = useMediaQuery('(min-width:800px)');
    const [value, setValue] = React.useState('0');

    const leagueSize = 8;
    const playerSize = 16;
    const [queueArr, setQueueArr] = useState(helper.buildQueueArray(leagueSize, playerSize));
    const [simpleQueueArr, setSimpleQueueArr] = useState(queueArr.filter(x => typeof(x.queueVal) !== 'string').map(x => x.queueVal));
    const [currDrafter, setCurrDrafter] = useState(1);
    const [round, setRound] = useState(1);
    const [queueIndex, setQueueIndex] = useState(0);

    const handleShiftQueue = () => {
        let currIndex = queueArr.findIndex(x => x.queueVal === currDrafter && x.round === round);
        setQueueArr(queueArr.filter((x, index) => index !== currIndex));
        let temp = queueArr;
        if (currDrafter === simpleQueueArr[queueIndex + 1]) {
            setRound(round + 1);
            temp.shift();
            temp.shift();
            setQueueArr(temp);
        }
        setCurrDrafter(simpleQueueArr[queueIndex + 1]);
        setQueueIndex(queueIndex + 1);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const renderCol1 = () => {
        return (
            <Box
                display="flex"
                flexDirection="column"
                minHeight="100vh" // Make the container at least 100vh tall
                p={0} // Add padding to the container
                // mt='20vh'
            >
                <Button onClick={handleShiftQueue}>Shift</Button>
                {queueArr.map((x, index) => (
                    <Box key={index} flexGrow={1} mb={0} sx={{border: '2px solid white'}}>
                        {x.queueVal}
                    </Box>
                ))}
            </Box>
        )
    };

    return (
        <TabContext value={value}>
        {isWideScreen ? (
            <Grid container spacing={0}>
                <Grid item xs={4}>
                    {renderCol1()}
                </Grid>
            <Grid item xs={4}>
                <Typography>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Interdum velit euismod in pellentesque massa. Consequat nisl vel pretium lectus quam id. Nisi est sit amet facilisis magna etiam tempor orci eu. 
                    Aliquet enim tortor at auctor urna. Tortor consequat id porta nibh. Vitae proin sagittis nisl rhoncus. Diam sit amet nisl suscipit adipiscing.
                </Typography>
            </Grid>
            <Grid item xs={4}>
                <Button variant='outlined'>Button 1</Button>
                <Button variant='outlined'>Button 2</Button>
                <Button variant='outlined'>Button 3</Button>
                <Button variant='outlined'>Button 4</Button>
                <Button variant='outlined'>Button 5</Button>
            </Grid>
        </Grid>
        ) : (
            <Box pb={5}>
                <Box position='fixed' bottom={0} width='100%' component={Paper}>
                    <Tabs value={value} onChange={handleChange} centered variant='fullWidth'>
                        <Tab label="Tab 1" value="0" />
                        <Tab label="Tab 2" value="1" />
                        <Tab label="Tab 3" value="2" />
                    </Tabs>
                </Box>
                <TabPanel value="0">{renderCol1()}</TabPanel>
                <TabPanel value="1">Content for Tab 2</TabPanel>
                <TabPanel value="2">Content for Tab 3</TabPanel>
            </Box>
        )}
        </TabContext>
    );
}

export default Testing;