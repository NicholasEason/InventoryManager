import { useRef, useState, useEffect } from "react";
import { TextField, Button, Alert, Snackbar, InputLabel, Select, MenuItem } from "@mui/material";

const NewInventoryItemForm = ({ warehouse, onUpdate, postUpdate }) => {
    const quantityRef = useRef();
    const sectionRef = useRef();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [allItems, setAllItems] = useState([]);
    const [selectedItemId, setSelectedItemId] = useState("");

    const getWarehouseCapacity = () => {
        return Number(warehouse["maxCapacity"] ?? warehouse["capacity"]) || 0;
    };

    const getCurrentUsed = () => {
        if (!warehouse || !warehouse["inventory"]) return 0;

        return warehouse["inventory"].reduce((sum, entry) => {
            return sum + (Number(entry["quantity"]) || 0);
        }, 0);
    };

    useEffect(() => {
        if (allItems.length && !selectedItemId) {
            setSelectedItemId(allItems[0]._id);
        }
    }, [allItems, selectedItemId]);

    useEffect(() => {
        let cancelled = false;

        const loadItems = async () => {
            try {
                let api_url = import.meta.env.VITE_API_HOST;
                if (import.meta.env.VITE_API_PORT) {
                    api_url += `:${import.meta.env.VITE_API_PORT}`;
                }
                api_url += `/items`;

                const response = await fetch(api_url);

                if (!response.ok) {
                    throw new Error(`Request Failed: ${response.status}`);
                }

                const data = await response.json();
                if (!cancelled) setAllItems(data);
            } catch (error) {
                if (!cancelled) setError(error);
            }
        };

        loadItems();

        return () => {
            cancelled = true;
        };
    }, []);

    const addItemToInventory = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        const section = sectionRef.current?.value || "";
        const quantity = Number(quantityRef.current?.value) || 0;

        if (!selectedItemId.trim() || !section.trim() || quantity <= 0) {
            setError(
                "Item, Quantity, and Section are required, and Quantity must be greater than 0.",
            );
            setSubmitting(false);
            return;
        }

        const cap = getWarehouseCapacity();
        const used = getCurrentUsed();
        const remaining = cap > 0 ? cap - used : null;

        if (cap > 0 && quantity > remaining) {
            setError(
                `Not enough remaining capacity. Remaining: ${remaining}. Requested: ${quantity}.`,
            );
            setSubmitting(false);
            return;
        }

        const selectedItem = allItems.find((item) => item["_id"] === selectedItemId);

        if (!selectedItem) {
            setError("Item not found.");
            setSubmitting(false);
            return;
        }

        const normalizedSection = section.trim().toLowerCase();

        const existingEntry = (warehouse.inventory || []).find((entry) => {
            const entryItemId = entry?.item?._id || entry?.item;
            const entrySection = (entry?.section || "").trim().toLowerCase();

            return entryItemId === selectedItemId && entrySection === normalizedSection;
        });

        if (existingEntry) {
            const newQty = (Number(existingEntry.quantity) || 0) + quantity;

            warehouse.inventory = (warehouse.inventory || []).map((entry) => {
                if (entry["_id"] === existingEntry["_id"]) {
                    return { ...entry, quantity: newQty, section: section.trim() };
                }
                return entry;
            });
        } else {
            const newItem = {
                quantity: quantity,
                section: section.trim(),
                item: selectedItem,
            };

            warehouse.inventory = [...(warehouse.inventory || []), newItem];
        }

        const newWarehouse = await postUpdate(warehouse);

        const serverItem = newWarehouse["inventory"].find((entry) => {
            const entryItemId = entry?.item?._id || entry?.item;
            const entrySection = (entry?.section || "").trim().toLowerCase();

            return entryItemId === selectedItemId && entrySection === normalizedSection;
        });

        onUpdate(serverItem);

        event.target.reset();
    };

    const cap = getWarehouseCapacity();
    const used = getCurrentUsed();
    const maxAllowed = cap > 0 ? Math.max(0, cap - used) : undefined;

    return (
        <>
            <form onSubmit={addItemToInventory}>
                <div>
                    <InputLabel id="itemName">Item</InputLabel>
                    <Select
                        labelId="itemName"
                        id="itemNameSelect"
                        value={selectedItemId}
                        onChange={(event) => {
                            setSelectedItemId(event.target.value);
                        }}
                    >
                        {allItems.map((item) => {
                            return (
                                <MenuItem
                                    key={item["_id"]}
                                    value={item["_id"]}
                                >
                                    {item.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </div>

                <div>
                    <TextField
                        id="inventoryQuantity"
                        label="Quantity:"
                        type="number"
                        inputRef={quantityRef}
                        variant="outlined"
                        slotProps={{
                            htmlInput: {
                                min: 0,
                                ...(maxAllowed !== undefined ? { max: maxAllowed } : {}),
                            },
                        }}
                        size="small"
                        sx={{ m: 2, width: 0.8 }}
                        helperText={
                            maxAllowed !== undefined ? `Remaining capacity: ${maxAllowed}` : ""
                        }
                    />
                </div>

                <div>
                    <TextField
                        id="inventorySection"
                        label="Section"
                        inputRef={sectionRef}
                        variant="outlined"
                        size="small"
                        sx={{ m: 2, width: 0.8 }}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={submitting}
                    variant="contained"
                    sx={{ m: 2, width: 0.8 }}
                >
                    Submit
                </Button>

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
                        <Alert severity="success">Inventory Added.</Alert>
                    </Snackbar>
                )}
            </form>
        </>
    );
};

export default NewInventoryItemForm;
