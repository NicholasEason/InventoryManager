require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({
    origin: CORS_ORIGIN
}));
app.use(express.json());

const warehouse_controller = require("./controllers/warehouse-controller");
app.use("/warehouses", warehouse_controller);

const item_controller = require("./controllers/item-controller");
app.use("/items", item_controller);

const PORT = process.env.API_PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});