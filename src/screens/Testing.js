import React from 'react';
import { Box, Button, Grid, Typography, Collapse, Tab, Tabs, Paper } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TabPanel, TabContext } from '@mui/lab';

const data = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']; // Replace with your data

// const Testing = () => {
//     const matches = useMediaQuery('(min-width: 600px)');
//     return (
//         <Grid container spacing={0}>
//             <Grid item xs={4} style={{ display: matches ? "block" : "none" }}>
//                 <Collapse in={matches}>
//                     <Box
//                         display="flex"
//                         flexDirection="column"
//                         minHeight="100vh" // Make the container at least 100vh tall
//                         p={0} // Add padding to the container
//                         // mt='20vh'
//                     >
//                     {data.map((item, index) => (
//                         <Box key={index} flexGrow={1} mb={0} sx={{border: '2px solid white'}}>
//                             {item}
//                         </Box>
//                     ))}
//                     </Box>
//                 </Collapse>
//             </Grid>
//             <Grid item xs={4}>
//                 <Typography>
//                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
//                     Interdum velit euismod in pellentesque massa. Consequat nisl vel pretium lectus quam id. Nisi est sit amet facilisis magna etiam tempor orci eu. 
//                     Aliquet enim tortor at auctor urna. Tortor consequat id porta nibh. Vitae proin sagittis nisl rhoncus. Diam sit amet nisl suscipit adipiscing.
//                 </Typography>
//             </Grid>
//             <Grid item xs={4}>
//                 <Button variant='outlined'>Button 1</Button>
//                 <Button variant='outlined'>Button 2</Button>
//                 <Button variant='outlined'>Button 3</Button>
//                 <Button variant='outlined'>Button 4</Button>
//                 <Button variant='outlined'>Button 5</Button>
//                 <Typography>{matches ? 'true' : 'false'}</Typography>
//             </Grid>
//         </Grid>
//     );
// };

const Testing = () => {
    const isWideScreen = useMediaQuery('(min-width:800px)');
    const [value, setValue] = React.useState('0');

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
            {data.map((item, index) => (
                <Box key={index} flexGrow={1} mb={0} sx={{border: '2px solid white'}}>
                    {item}
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