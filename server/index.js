require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({
    origin: CORS_ORIGIN
}));
app.use(express.json());

const warehouse_router = require("./routes/warehouse-routes");
app.use("/warehouses", warehouse_router);

const item_router = require("./routes/item-routes");
app.use("/items", item_router);

const dbConnection = require("./config/database");
dbConnection.connectToDB();

const PORT = process.env.API_PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});