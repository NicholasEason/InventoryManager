const Item = require("../models/item");

const getAllItems = async () => {
    let response = {};
    let error = null;

    await Item.find().then((res) => {
        response = res;
    }).catch((err) => {
        error = genericHandleErrors(err);
        if(error.status == 500)
            error.message = "Internal Server Error"
    });

    return {response: response, error: error};
}

const getItemById = async (id) => {
    let response = {};
    let error = null;

    await Item.findById(id).then((res) => {
        console.log(res);
        response = res;
    }).catch((err) => {
        error = genericHandleErrors(err);
        if(error.status == 500)
            error.message = "Internal Server Error";
    });

    return {response: response, error: error};
}

const createItem = async (itemJSON) => {
    let response = {};
    let error = null;
    await Item.create(itemJSON).then(async (res) => {
        console.log(res);
        ({response, error} = await getItemById(res['_id']));
    }).catch((err) => {
        console.log(err);
        if(!error){
            error = genericHandleErrors(err);
            if(error.status == 500)
                error.message = `Failed to create Item as requested.}`;
        }
    });

    return {response: response, error: error};
}

const updateItem = async (itemJSON, id) => {
    let response = {};
    let error = null;
    await Item.updateOne({_id: id}, itemJSON).then(async (res) => {
        ({response, error} = await getItemById(id));
    }).catch((err) => {
        console.log(err);
        if(!error){
            error = genericHandleErrors(err);
            if(error.status == 500)
                error.message = `Failed to update Item with ID ${id}`;
        }
    });
    return {response: response, error: error};
}

const deleteItem = async (id) => {
    let response = {};
    let error = null;
    await Item.deleteOne({_id: id}).then(async (res) => {
        response = `Successfully deleted Item ID ${id}`;
    }).catch((err) => {
        console.log(err);
        if(!error){
            error = genericHandleErrors(err);
            if(error.status == 500)
                error.message = `Failed to delete Item with ID ${id}`;
        }
    });
    console.log(`Response is:\n${response}`);
    return {response: response, error: error};
}

module.exports = {getAllItems, getItemById, createItem, updateItem, deleteItem};

const genericHandleErrors = (error) => {
    if(!error) {
        return;
    }

    message = {};

    if(error.message.includes("timed out")){
        message.status = 504;
        message.message = "Connection to database timed out."
    } else {
        //We'll let each endpoint send its own generic message for 500 errors
        message.status = 500;
    }

    return message;
}