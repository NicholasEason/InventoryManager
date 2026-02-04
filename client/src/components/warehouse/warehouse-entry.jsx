import {
    Typography,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useState } from "react";

const WarehouseEntry = ({ id, name, location, maxCapacity, inventory, onUpdate, onDelete }) => {
    const [inventoryOpen, setInventoryOpen] = useState(false);

    const handleUpdate = () => {
        onUpdate(id);
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
                    onClick={handleUpdate}
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
                            e.stopPropagation(); // so the parent click doesn't fire twice
                            setInventoryOpen(!inventoryOpen);
                        }}
                    >
                        {inventoryOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </div>

                {/* Collapsible inventory list */}
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
        </>
    );
};

const ItemSubEntry = ({ quantity, section, item }) => {
    return (
        <>
            <p>Item Name: {item.name}</p>
            <div>
                <p>Quantity: {quantity}</p>
                <p>Section: {section}</p>
                <p>Item SKU: {item.sku}</p>
            </div>
            <p>Item Description: {item.description}</p>
        </>
    );
};

export default WarehouseEntry;
