const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/warehouse-controller");

router.route("/")
.get((req, res) => {
    warehouseController.getAllWarehouses(req, res);
})
.post((req, res) => {
    warehouseController.createWarehouse(req, res);
});

router.route("/:id")
.get((req, res) => {
    warehouseController.getWarehouseById(req, res, req.params.id);
})
.put((req, res) => {
    warehouseController.updateWarehouse(req, res, req.params.id);
})
.delete((req, res) => {
    warehouseController.deleteWarehouse(req, res, req.params.id);
});

module.exports = router;