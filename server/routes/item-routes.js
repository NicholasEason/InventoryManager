const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item-controller");

router.route("/")
.get((req, res) => {
    itemController.getAllItems(req, res);
})
.post(async (req, res) => {
    itemController.updateItem(req, res);
});

router.route("/:id")
.get(async (req, res) => {
    itemController.getItemById(req, res, req.params.id);
})
.put(async (req, res) => {
    itemController.updateItem(req, res);
})
.delete(async (req, res) => {
    itemController.deleteItem(req, res, req.params.id);
});

module.exports = router;