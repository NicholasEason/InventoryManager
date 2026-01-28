const express = require("express");
const router = express.Router();
const itemRepo = require("../repositories/item-repo");
const Item = require("../models/item");

router.route("/")
.get(async (req, res) => {
    let {response, error} = await itemRepo.getAllItems();
    if(error){
        res.status(404).send("No items found.");
    } else {
        res.status(200).send(response);
    }
})
.post(async (req, res) => {
    let item = new Item(req.body.id);
    let {response, error} = await itemRepo.createItem(item);
    if(error){
        res.status(500).send("Something went wrong.");
    } else {
        res.status(201).send(response);
    }
});

router.route("/:id")
.get(async (req, res) => {
    let {response, error} = await itemRepo.getItemById(req.params.id);
    if(error){
        res.status(404).send(`No item found at ID ${req.params.id}.`);
    } else {
        res.status(200).send(response);
    }
})
.put(async (req, res) => {
    //req.body should contain all of the necessary information to fulfill a PUT
    let item = new Item(req.params.id);
    let {response, error} = await itemRepo.updateItem(item);
    if(error){
        res.status(500).send("Something went wrong.");
    } else {
        res.status(200).send(response);
    }
})
.delete(async (req, res) => {
    let {response, error} = await itemRepo.deleteItem(req.params.id);
    if(error){
        res.status(404).send(`No item found at ID ${req.params.id}.`);
    } else {
        res.status(200).send(response);
    }
});

module.exports = router;