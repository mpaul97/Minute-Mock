import Home from "./screens/Home";
import Mock from "./screens/Mock";
import Testing from "./screens/Testing";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
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
      <BrowserRouter>
        <Routes>
          <Route exact path="/mock/home" element={<Home />} />
          <Route path="/mock/content" element={<Mock />} />
        </Routes>
      </BrowserRouter>
      {/* <Testing /> */}
    </ThemeProvider>
  )
}

export default App;