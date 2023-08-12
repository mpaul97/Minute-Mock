import Home from "./screens/Home";
import Mock from "./screens/Mock";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { createTheme, ThemeProvider, Container, CssBaseline } from "@mui/material";
import { orange, purple } from "@mui/material/colors";

const theme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route exact path="/mock/home" element={<Home />} />
          <Route path="/mock/content" element={<Mock />} />
        </Routes>
      </BrowserRouter>
      {/* <Mock /> */}
    </ThemeProvider>
  )
}

export default App;