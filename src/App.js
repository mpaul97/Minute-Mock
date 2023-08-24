import Home from "./screens/Home";
import Mock from "./screens/Mock";
import Testing from "./screens/Testing";
import { BrowserRouter, Route, Routes, Link, HashRouter } from "react-router-dom";
import { createTheme, ThemeProvider, Container, CssBaseline } from "@mui/material";
import { blue, deepOrange, amber } from "@mui/material/colors";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: blue,
        secondary: amber
    }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/content" element={<Mock />} />
        </Routes>
      </HashRouter>
      {/* <Testing /> */}
    </ThemeProvider>
  )
}

export default App;