const warehouseRepo = require("../repositories/warehouse-repo");

const getAllWarehouses = async () => {
    const {response, error} = await warehouseRepo.getAllWarehouses();
    if(error){
        console.error(error);
        return {response, error};
    }
    return {response, error};
}

const getWarehouseById = async (id) => {
    const {response, error} = await warehouseRepo.getWarehouseById(id);
    if(error){
        console.log(error);
    } else {
        return {response, error};
    }
}

const createWarehouse = async (warehouseJSON) => {
    if(warehouseJSON.inventory) {
        warehouseJSON.inventory = [];
    }
    const {response, error} = await warehouseRepo.createWarehouse(warehouseJSON);
    if(error){
        console.log(error);
    } else {
        return {response, error};
    }
}

const updateWarehouse = async (warehouseJSON, id) => {
    if(warehouseJSON['_id'])
        delete warehouseJSON['_id'];

    const {response, error} = await warehouseRepo.updateWarehouse(warehouseJSON, id);
    if(error){
        console.log(error);
    } else {
        return {response, error};
    }
}

const deleteWarehouse = async (id) => {
        const {response, error} = await warehouseRepo.deleteWarehouse(id);
    if(error){
        console.log(error);
    } else {
        return {response, error};
    }
}

module.exports = {getAllWarehouses, getWarehouseById, createWarehouse, updateWarehouse, deleteWarehouse}