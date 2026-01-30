const warehouseRepo = require("../repositories/warehouse-repo");

const getAllWarehouses = async () => {
    const {response, error} = await warehouseRepo.getAllWarehouses();
    if(error){
        //TODO: Logging later?
        console.error(error);
        return {response, error};
    }
    return {response, error};
}

const getWarehouseById = async (id) => {
    const {response, error} = await warehouseRepo.getWarehouseById(id);
    if(error){
        //Errors from below will bubble up to the controller for the response to be sent.
        console.log(error);
    } else {
        return {response, error};
    }
}

const createWarehouse = async (warehouseJSON) => {
    if(warehouseJSON.inventory) {
        //Dont let users submit a new warehouse with any inventory.
        //They can add/manage items later.
        warehouseJSON.inventory = [];
    }
    const {response, error} = await warehouseRepo.createWarehouse(warehouseJSON);
    if(error){
        //TODO: do something with the error
        console.log(error);
    } else {
        return {response, error};
    }
}

const updateWarehouse = async (warehouseJSON, id) => {
    //Remove ID from JSON if it was provided
    if(warehouseJSON['_id'])
        delete warehouseJSON['_id'];

    const {response, error} = await warehouseRepo.updateWarehouse(warehouseJSON, id);
    if(error){
        //TODO: do something with the error
        console.log(error);
    } else {
        return {response, error};
    }
}

const deleteWarehouse = async (id) => {
        const {response, error} = await warehouseRepo.deleteWarehouse(id);
    if(error){
        //TODO: do something with the error
        console.log(error);
    } else {
        return {response, error};
    }
}

module.exports = {getAllWarehouses, getWarehouseById, createWarehouse, updateWarehouse, deleteWarehouse}