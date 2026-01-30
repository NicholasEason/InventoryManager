const itemRepo = require("../repositories/item-repo");

const getAllItems = async () => {
    const {response, error} = await itemRepo.getAllItems();
    if(error){
        //TODO: do something with the error
        console.error(error);
    } else {
        return {response, error};
    }
}

const getItemById = async (id) => {
    const {response, error} = await itemRepo.getItemById(id);
    if(error){
        //TODO: do something with the error
        console.log(error);
    } else {
        return {response, error};
    }
}

const createItem = async (itemJSON) => {
    const {response, error} = await itemRepo.createItem(itemJSON);
    if(error){
        //TODO: do something with the error
        console.log(error);
    } else {
        return {response, error};
    }
}

const updateItem = async (itemJSON, id) => {
    //Remove ID from JSON if it was provided
    if(itemJSON['_id'])
        delete itemJSON['_id'];
    const {response, error} = await itemRepo.updateItem(itemJSON, id);
    if(error){
        //TODO: do something with the error
        console.log(error);
    } else {
        return {response, error};
    }
}

const deleteItem = async (id) => {
        const {response, error} = await itemRepo.deleteItem(id);
    if(error){
        //TODO: do something with the error
        console.log(error);
    } else {
        return {response, error};
    }
}

module.exports = {getAllItems, getItemById, createItem, updateItem, deleteItem}