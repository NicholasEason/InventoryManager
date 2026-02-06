import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Box, Button, Stack } from "@mui/material";

import Warehouses from "./routes/Warehouses";
import Items from "./routes/Items";
import Overview from "./routes/Overview";

const NavBar = () => {
    return (
        <Box
            sx={{
                width: "100%",
                borderBottom: "1px solid #ddd",
                mb: 2,
                py: 1,
            }}
        >
            <Stack
                direction="row"
                spacing={1}
                sx={{ width: "80%", mx: "auto" }}
            >
                <NavLink
                    to="/"
                    end
                >
                    <Button variant="text">Overview</Button>
                </NavLink>

                <NavLink to="/warehouses">
                    <Button variant="text">Warehouses</Button>
                </NavLink>

                <NavLink to="/items">
                    <Button variant="text">Items</Button>
                </NavLink>
            </Stack>
        </Box>
    );
};

function App() {
    return (
        <BrowserRouter>
            <NavBar />

            <Routes>
                <Route
                    path="/"
                    element={<Overview />}
                />
                <Route
                    path="/warehouses"
                    element={<Warehouses />}
                />
                <Route
                    path="/items"
                    element={<Items />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
