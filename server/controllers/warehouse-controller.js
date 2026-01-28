const express = require("express");
const router = express.Router();
const warehouseRepo = require("../repositories/warehouse-repo");
const Warehouse = require("../models/warehouse");

router.route("/")
.get(async (req, res) => {
    let {response, error} = await warehouseRepo.getAllWarehouses();
    if(error){
        res.status(404).send("No warehouses found.");
    } else {
        res.status(200).send(response);
    }
})
.post(async (req, res) => {
    let warehouse = new Warehouse(req.body.id);
    let {response, error} = await warehouseRepo.createWarehouse(warehouse);
    if(error){
        res.status(500).send("Something went wrong.");
    } else {
        res.status(201).send(response);
    }
});

router.route("/:id")
.get(async (req, res) => {
    let {response, error} = await warehouseRepo.getWarehouseById(req.params.id);
    if(error){
        res.status(404).send(`No warehouse found at ID ${req.params.id}.`);
    } else {
        res.status(200).send(response);
    }
})
.put(async (req, res) => {
    //req.body should contain all of the necessary information to fulfill a PUT
    let warehouse = new Warehouse(req.params.id);
    let {response, error} = await warehouseRepo.updateWarehouse(warehouse);
    if(error){
        res.status(500).send("Something went wrong.");
    } else {
        res.status(200).send(response);
    }
})
.delete(async (req, res) => {
    let {response, error} = await warehouseRepo.deleteWarehouse(req.params.id);
    if(error){
        res.status(404).send(`No warehouse found at ID ${req.params.id}.`);
    } else {
        res.status(200).send(response);
    }
});

module.exports = router;