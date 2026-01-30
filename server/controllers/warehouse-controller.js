const warehouseService = require("../services/warehouse-service");

const getAllWarehouses = async (req, res) => {
    let {response, error} = await warehouseService.getAllWarehouses();
    if(error){
        res.status(error.status).send(error.message);
    } else {
        res.status(200).send(response);
    }
}

const getWarehouseById = async (req, res, id) => {
    let response = "";
    let error = null;

    try{
        ({response, error} = await warehouseService.getWarehouseById(id));
    } catch (error){
        res.status(404).send(`No warehouse found with ID ${id}.`);
        return;
    }

    if(error){
        res.status(error.status).send(error.message);
    } else {
        res.status(200).send(response);
    }
}

const createWarehouse = async (req, res) => {
    let response = "";
    let error = null;

    try{
        ({response, error} = await warehouseService.createWarehouse(req.body));
    } catch (error){
        res.status(400).send("Bad Request");
        return;
    }

    if(error){
        res.status(500).send("Something went wrong.");
    } else {
        res.status(201).send(response);
    }
}

const updateWarehouse = async (req, res, id) => {
    let response = "";
    let error = null;

    try{
        ({response, error} = await warehouseService.updateWarehouse(req.body, id));
    } catch (error){
        res.status(400).send("Bad Request");
        return;
    }

    if(error){
        res.status(500).send("Something went wrong.");
    } else {
        res.status(200).send(response);
    }
}

const deleteWarehouse = async (req, res, id) => {
    let {response, error} = await warehouseService.deleteWarehouse(id);
    if(error){
        res.status(404).send(`No warehouse found at ID ${req.params.id}.`);
    } else {
        res.status(200).send(response);
    }
}

module.exports = {getAllWarehouses, getWarehouseById, createWarehouse, updateWarehouse, deleteWarehouse};