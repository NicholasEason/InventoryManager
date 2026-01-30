const itemService = require("../services/item-service");

const getAllItems = async (req, res) => {
    const {response, error} = await itemService.getAllItems();

    if(error){
        res.status(error.status).send(error.message);
    } else {
        res.status(200).send(response);
    }
}

const getItemById = async (req, res, id) => {
    let response = "";
    let error = null;

    try{
        ({response, error} = await itemService.getItemById(id));
    } catch (error){
        res.status(404).send(`No Item found with ID ${id}.`);
        return;
    }

    if(error){
        res.status(error.status).send(error.message);
    } else {
        res.status(200).send(response);
    }
}

const createItem = async (req, res) => {
    let response = "";
    let error = null;

    try{
        ({response, error} = await itemService.createItem(req.body));
    } catch (error){
        console.log(error);
        res.status(400).send("Bad Request");
        return;
    }

    if(error){
        res.status(500).send("Something went wrong.");
    } else {
        res.status(201).send(response);
    }
}

const updateItem = async (req, res, id) => {
    let response = "";
    let error = null;

    try{
        ({response, error} = await itemService.updateItem(req.body, id));
    } catch (error){
        console.log(error);
        res.status(400).send("Bad Request");
        return;
    }

    if(error){
        res.status(500).send("Something went wrong.");
    } else {
        res.status(200).send(response);
    }
}

const deleteItem = async (req, res, id) => 
{
    let response = "";
    let error = null;

    try{
        ({response, error} = await itemService.deleteItem(id));
    } catch (error){
        res.status(400).send("Bad Request");
        return;
    }
    if(error){
        res.status(404).send(`No item found at ID ${req.params.id}.`);
    } else {
        res.status(200).send(response);
    }
}

module.exports = {getAllItems, getItemById, createItem, updateItem, deleteItem};