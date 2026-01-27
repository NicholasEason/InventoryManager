const express = require("express");
const router = express.Router();

router.route("/")
.get((req, res) => {
    //TODO: Connect to database and return all items
    res.status(200).send("GET to Items successful!");
})
.post((req, res) => {
    //TODO: Connect to database and submit new item to the database
    res.status(201).send("POST to Items successful!");
});

router.route("/:id")
.get((req, res) => {
    //TODO: Connect to database and return item from database
    res.status(200).send(`GET to Item ID ${req.params.id} successful!`);
})
.put((req, res) => {
    //TODO: Connect to database and update item in the database
    res.status(200).send(`PUT to Item ID ${req.params.id} successful!`);
})
.delete((req, res) => {
    //TODO: Connect to database and delete item in the database
    res.status(204);
});

module.exports = router;