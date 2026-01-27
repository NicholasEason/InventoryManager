const express = require("express");
const router = express.Router();

router.route("/")
.get((req, res) => {
    //TODO: Connect to database and return all warehouses
    res.status(200).send("GET to Warehouses successful!");
})
.post((req, res) => {
    //TODO: Connect to database and submit new warehouse to the database
    res.status(201).send("POST to Warehouses successful!");
});

router.route("/:id")
.get((req, res) => {
    //TODO: Connect to database and return warehouse from database
    res.status(200).send(`GET to Warehouse ID ${req.params.id} successful!`);
})
.put((req, res) => {
    //TODO: Connect to database and update warehouse in the database
    res.status(200).send(`PUT to Warehouse ID ${req.params.id} successful!`);
})
.delete((req, res) => {
    //TODO: Connect to database and delete warehouse in the database
    res.status(204);
});

module.exports = router;