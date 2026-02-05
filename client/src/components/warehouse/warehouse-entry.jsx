import {
    Typography,
    Button,
    IconButton,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";
import UpdateWarehouseForm from "./update-warehouse-form";
import ItemSubEntry from "../item/item-sub-entry";

const WarehouseEntry = ({ id, name, location, maxCapacity, inventory, onUpdate, onDelete }) => {
    const [inventoryOpen, setInventoryOpen] = useState(false);
    const [updateWarehouseModal, setUpdateWarehouseModal] = useState(false);
    const [lastUpdatedWarehouse, setLastUpdatedWarehouse] = useState("");

    const handleUpdate = (updatedWarehouse) => {
        onUpdate(id, updatedWarehouse);
    };

    const handleDelete = () => {
        onDelete(id);
    };

    const handleUpdateItem = () => {};

    const handleDeleteItem = () => {};

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
                        {inventory.map((itemEntry) => (
                            <ItemSubEntry
                                key={itemEntry["_id"]}
                                quantity={itemEntry["quantity"]}
                                section={itemEntry["section"]}
                                item={itemEntry["item"]}
                            />
                        ))}
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
        </>
    );
};

export default WarehouseEntry;
