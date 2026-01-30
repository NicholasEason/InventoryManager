const Warehouse = require("../models/warehouse");
const Item = require("../models/item");

const getAllWarehouses = async () => {
    let response = {};
    let error = null;

    await Warehouse.find().populate("inventory.item").then((res) => {
        response = res;
    }).catch((err) => {
        /*
        TODO: Timeouts should return a 504, everything else here a 500
            MongooseError: Operation `warehouses.find()` buffering timed out after 10000ms at Timeout._onTimeout
        */
        console.log(err);
        error = {};
        error.status = 500;
        error.message = "Internal Server Error"
    });

    return {response: response, error: error};
}

const getWarehouseById = async (id) => {
    let response = {};
    let error = null;

    await Warehouse.findById(id).populate("inventory.item").then((res) => {
        console.log(res);
        response = res;
    }).catch((err) => {
        console.log(err);
        error = {};
        error.status = 500;
        error.message = "Internal Server Error";
    });

    return {response: response, error: error};
}

const createWarehouse = async (warehouseJSON) => {
    let response = {};
    let error = null;
    await Warehouse.create(warehouseJSON).then(async (res) => {
        ({response, error} = await getWarehouseById(warehouseJSON['_id']));
    }).catch((err) => {
        console.log(err);
        if(!error){
            error = {};
            error.status = 500;
            error.message = `Failed to create Warehouse with ID ${warehouseJSON['_id']}`;
        }
    });

    return {response: response, error: error};
}

const updateWarehouse = async (warehouseJSON, id) => {
    let response = {};
    let error = null;
    await Warehouse.updateOne({_id: id}, warehouseJSON).then(async (res) => {
        ({response, error} = await getWarehouseById(id));
    }).catch((err) => {
        console.log(err);
        if(!error){
            error = {};
            error.status = 500;
            error.message = `Failed to update Warehouse with ID ${id}`;
        }
    });
    return {response: response, error: error};
}

const deleteWarehouse = async (id) => {
    let response = {};
    let error = null;
    await Warehouse.deleteOne({_id: id}).then(async (res) => {
        response = `Successfully deleted Warehouse ID ${id}`;
    }).catch((err) => {
        console.log(err);
        if(!error){
            error = {};
            error.status = 500;
            error.message = `Failed to delete Warehouse with ID ${id}`;
        }
    });
    return {response: response, error: error};
}

module.exports = {getAllWarehouses, getWarehouseById, createWarehouse, updateWarehouse, deleteWarehouse};