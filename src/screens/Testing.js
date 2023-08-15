import React from 'react';
import { Box } from '@mui/material';

const data = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']; // Replace with your data

const Testing = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="80vh" // Make the container at least 100vh tall
      p={0} // Add padding to the container
      mt='20vh'
    >
      {data.map((item, index) => (
        <Box key={index} flexGrow={1} mb={0} sx={{border: '2px solid white'}}>
          {item}
        </Box>
      ))}
    </Box>
  );
};

export default Testing;