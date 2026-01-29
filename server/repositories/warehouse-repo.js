const getAllWarehouses = async () => {
    //TODO: Connect to database and return all warehouses
    let response = "GET to Warehouses successful!";
    let error = null;
    return {response: response, error: error};
}

const getWarehouseById = async (id) => {
    //TODO: Connect to database and submit new warehouse to the database
    let response = `GET to Warehouse ${id} successful!`;
    let error = null;
    return {response: response, error: error};
}

const createWarehouse = async (warehouseJSON) => {
    //TODO: Connect to database and return warehouse from database
    let response = `POST to create ${warehouseJSON.id} successful!`;
    let error = null;
    return {response: response, error: error};
}

const updateWarehouse = async (warehouseJSON) => {
    //TODO: Connect to database and update warehouse in the database
    let response = `PUT to update ${warehouseJSON.id} successful!`;
    let error = null;
    return {response: response, error: error};
}

const deleteWarehouse = async (id) => {
    //TODO: Connect to database and delete warehouse in the database
    let response = `DELETE to delete warehouse ID ${id} successful!`;
    let error = null;
    return {response: response, error: error};
}

module.exports = {getAllWarehouses, getWarehouseById, createWarehouse, updateWarehouse, deleteWarehouse};