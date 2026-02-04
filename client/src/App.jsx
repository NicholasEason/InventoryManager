import { BrowserRouter, Routes, Route } from "react-router-dom";

import NewWarehouseForm from "./components/warehouse/new-warehouse-form";
import WarehouseList from "./components/warehouse/warehouse-list";

function App() {
    return (
        <>
            <WarehouseList />
        </>
    );
}

export default App;
