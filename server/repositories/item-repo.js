const getAllItems = async () => {
    //TODO: Connect to database and return all items
    let response = "GET to Items successful!";
    let error = null;
    return {response: response, error: error};
}

const getItemById = async (id) => {
    //TODO: Connect to database and submit new item to the database
    let response = `GET to item ${id} successful!`;
    let error = null;
    return {response: response, error: error};
}

const createItem = async (item) => {
    //TODO: Connect to database and return item from database
    let response = `POST to create ${item} successful!`;
    let error = null;
    return {response: response, error: error};
}

const updateItem = async (item) => {
    //TODO: Connect to database and update item in the database
    let response = `PUT to update ${item} successful!`;
    let error = null;
    return {response: response, error: error};
}

const deleteItem = async (id) => {
    //TODO: Connect to database and delete item in the database
    let response = `DELETE to delete item ID ${id} successful!`;
    let error = null;
    return {response: response, error: error};
}

module.exports = {getAllItems, getItemById, createItem, updateItem, deleteItem};