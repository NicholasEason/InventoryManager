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
    Box,
    Stack,
    Divider,
    Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";
import UpdateWarehouseForm from "./update-warehouse-form";
import ItemSubEntry from "../item/item-sub-entry";
import NewInventoryItemForm from "../inventory/new-inventory-item-form";
import DeleteConfirmation from "../extras/delete-confirmation";

const WarehouseEntry = ({ id, name, location, maxCapacity, inventory, onUpdate, onDelete }) => {
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [updateWarehouseModal, setUpdateWarehouseModal] = useState(false);
    const [itemInventory, setItemInventory] = useState([...inventory]);
    const [newItemModal, setNewItemModal] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

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
            const exists = oldState.some((entry) => entry["_id"] === inventoryEntry["_id"]);

            if (exists) {
                return oldState.map((entry) =>
                    entry["_id"] === inventoryEntry["_id"] ? inventoryEntry : entry,
                );
            }

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
            <Box>
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1}
                >
                    <Box>
                        <Typography variant="h6">{name}</Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {location}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{ mt: 0.75 }}
                        >
                            <Chip
                                label={`Max Capacity: ${maxCapacity}`}
                                variant="outlined"
                                size="small"
                            />
                        </Stack>
                    </Box>

                    <Stack
                        direction="row"
                        spacing={1}
                    >
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
                            onClick={() => setDeleteConfirmation(true)}
                        >
                            Delete
                        </Button>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 1.5 }} />

                <Box>
                    <Box
                        onClick={() => setInventoryOpen(!inventoryOpen)}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            cursor: "pointer",
                            userSelect: "none",
                        }}
                    >
                        <Typography
                            component="span"
                            fontWeight={600}
                        >
                            Inventory
                        </Typography>

                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                setInventoryOpen(!inventoryOpen);
                            }}
                        >
                            {inventoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>

                    <Collapse
                        in={inventoryOpen}
                        unmountOnExit
                    >
                        <Box sx={{ mt: 1.25 }}>
                            {itemInventory.length === 0 ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    No inventory items in this warehouse.
                                </Typography>
                            ) : null}

                            {itemInventory.map((itemEntry) => {
                                return (
                                    <ItemSubEntry
                                        key={itemEntry["_id"]}
                                        warehouse={{
                                            _id: id,
                                            name: name,
                                            location: location,
                                            capacity: maxCapacity,
                                            inventory: itemInventory,
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
                            <Box sx={{ mt: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => setNewItemModal(true)}
                                >
                                    Add New Item
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </Box>
            </Box>

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
                            inventory: itemInventory,
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

            <DeleteConfirmation
                active={deleteConfirmation}
                onDelete={handleDelete}
                message={`Are you sure you'd like to delete ${name}?`}
                title={`Delete ${name}`}
                onClose={() => setDeleteConfirmation(false)}
            />
        </>
    );
};

export default WarehouseEntry;
