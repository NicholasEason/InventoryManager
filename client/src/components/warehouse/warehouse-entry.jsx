import {
    Typography,
    Button,
    IconButton,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Snackbar,
    Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";
import UpdateWarehouseForm from "./update-warehouse-form";
import ItemSubEntry from "../item/item-sub-entry";
import NewInventoryItemForm from "../inventory/new-inventory-item-form";

const WarehouseEntry = ({ id, name, location, maxCapacity, inventory, onUpdate, onDelete }) => {
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [updateWarehouseModal, setUpdateWarehouseModal] = useState(false);
    const [itemInventory, setItemInventory] = useState([...inventory]);
    const [newItemModal, setNewItemModal] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const postUpdate = async (warehouse) => {
        try {
            let api_url = import.meta.env.VITE_API_HOST;
            if (import.meta.env.VITE_API_PORT) {
                api_url += `:${import.meta.env.VITE_API_PORT}`;
            }
            api_url += `/warehouses/${warehouse["_id"]}`;

            const request = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: warehouse["name"],
                    location: warehouse["location"],
                    maxCapacity: warehouse["maxCapacity"],
                    inventory: warehouse["inventory"],
                }),
            };
            const response = await fetch(api_url, request);

            if (!response.ok) {
                throw new Error(response);
            }

            setSuccess(true);
            const jsonData = await response.json();

            return jsonData;
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdate = (updatedWarehouse) => {
        onUpdate(id, updatedWarehouse);
    };

    const handleDelete = () => {
        onDelete(id);
    };

    const handleAddInventory = (inventoryEntry) => {
        setItemInventory((oldState) => {
            return [...oldState, inventoryEntry];
        });
    };

    const handleUpdateInventoryItem = (warehouse) => {
        setItemInventory(warehouse.inventory);
    };

    const handleDeleteItem = (id) => {
        setItemInventory((oldState) => {
            return oldState.filter((itemEntry) => itemEntry["_id"] != id);
        });
    };

    return (
        <>
            <span>
                <Typography variant="h6">{name}</Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    {location}
                </Typography>
                <Typography variant="body2">Max Capacity: {maxCapacity}</Typography>
            </span>

            <span>
                {/* This update button is for managing warehouse details but not inventory */}
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => setUpdateWarehouseModal(true)}
                >
                    Edit
                </Button>

                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </span>
            <div>
                <div
                    onClick={() => setInventoryOpen(!inventoryOpen)}
                    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                >
                    <Typography component="span">Inventory</Typography>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            setInventoryOpen(!inventoryOpen);
                        }}
                    >
                        {inventoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </div>

                <Collapse
                    in={inventoryOpen}
                    unmountOnExit
                >
                    <div>
                        {itemInventory.map((itemEntry) => {
                            return (
                                <ItemSubEntry
                                    key={itemEntry["_id"]}
                                    warehouse={{
                                        _id: id,
                                        name: name,
                                        location: location,
                                        capacity: maxCapacity,
                                        inventory: inventory,
                                    }}
                                    id={itemEntry["_id"]}
                                    quantity={itemEntry["quantity"]}
                                    section={itemEntry["section"]}
                                    item={itemEntry["item"]}
                                    postUpdate={postUpdate}
                                    onUpdate={handleUpdateInventoryItem}
                                    onDelete={handleDeleteItem}
                                />
                            );
                        })}
                        <Button
                            variant="outlined"
                            onClick={() => setNewItemModal(true)}
                        >
                            Add New Item
                        </Button>
                    </div>
                </Collapse>
            </div>

            <Dialog
                open={updateWarehouseModal}
                onClose={() => setUpdateWarehouseModal(false)}
            >
                <DialogTitle>{`Edit Warehouse "${name}"`}</DialogTitle>
                <DialogContent>
                    <UpdateWarehouseForm
                        warehouseId={id}
                        onUpdate={(data) => {
                            handleUpdate(data);
                            setUpdateWarehouseModal(false);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setUpdateWarehouseModal(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={newItemModal}
                onClose={() => setNewItemModal(false)}
            >
                <DialogTitle>{`Add Item to Warehouse "${name}"`}</DialogTitle>
                <DialogContent>
                    <NewInventoryItemForm
                        warehouse={{
                            _id: id,
                            name: name,
                            location: location,
                            capacity: maxCapacity,
                            inventory: inventory,
                        }}
                        onUpdate={(data) => {
                            handleAddInventory(data);
                            setNewItemModal(false);
                        }}
                        postUpdate={postUpdate}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setNewItemModal(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
            {error && (
                <Snackbar
                    open={error}
                    autoHideDuration={5000}
                    onClose={() => setError(null)}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                >
                    <Alert severity="error">Error: {error}</Alert>
                </Snackbar>
            )}

            {success && (
                <Snackbar
                    open={success}
                    autoHideDuration={5000}
                    onClose={() => setSuccess(false)}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                >
                    <Alert severity="success">Inventory updated.</Alert>
                </Snackbar>
            )}
        </>
    );
};

export default WarehouseEntry;
