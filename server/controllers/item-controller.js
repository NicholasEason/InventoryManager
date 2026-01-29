const itemService = require("../services/item-service");

const getAllItems = async (req, res) => {
    const {response, error} = await itemService.getAllItems();

    if(error){
        res.status(404).send("No items found.");
    } else {
        res.status(200).send(response);
    }
}

const getItemById = async (req, res, id) => {
    const {response, error} = await itemService.getItemById(id);

    if(error){
        res.status(404).send("No items found.");
    } else {
        res.status(200).send(response);
    }
}

const createItem = async (req, res) => {
    let {response, error} = await itemService.createItem(req.body);

    if(error){
        res.status(500).send("Something went wrong.");
    } else {
        res.status(201).send(response);
    }
}

const updateItem = async (req, res) => {
    let {response, error} = await itemService.updateItem(req.body);
    if(error){
        res.status(500).send("Something went wrong.");
    } else {
        res.status(200).send(response);
    }
}

const deleteItem = async (req, res, id) => 
{
    let {response, error} = await itemService.deleteItem(id);
    if(error){
        res.status(404).send(`No item found at ID ${id}.`);
    } else {
        res.status(200).send(response);
    }
}

module.exports = {getAllItems, getItemById, createItem, updateItem, deleteItem};