const warehouseRepo = require("../repositories/warehouse-repo");

const getAllWarehouses = async () => {
    const {response, error} = await warehouseRepo.getAllWarehouses();
    if(error){
        //TODO: do something with the error
        console.log(error);
    } else {
        return {response, error};
    }
}

const getWarehouseById = async (id) => {
    const {response, error} = await warehouseRepo.getWarehouseById(id);
    if(error){
        //TODO: do something with the error
        console.log(error);
    } else {
        return {response, error};
    }
}

const createWarehouse = async (warehouseJSON) => {
    const {response, error} = await warehouseRepo.createWarehouse(warehouseJSON);
    if(error){
        //TODO: do something with the error
        console.log(error);
    } else {
        return {response, error};
    }
}

const updateWarehouse = async (id, warehouseJSON) => {
    const {response, error} = await warehouseRepo.updateWarehouse(id, warehouseJSON);
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