import { BrowserRouter, Routes, Route } from "react-router-dom";

import WarehouseList from "./components/warehouse/warehouse-list";
import ItemList from "./components/item/item-list";

function App() {
    return (
        <>
            <ItemList />
        </>
    );
}

export default App;
