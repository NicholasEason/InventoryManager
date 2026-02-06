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

        let newItem = {
            quantity: quantity,
            section: section,
            item: allItems.find((item) => item["_id"] === selectedItemId),
        };

        warehouse.inventory.push(newItem);

        const newWarehouse = await postUpdate(warehouse);

        const serverItem = newWarehouse["inventory"].find(
            (itemEntry) =>
                itemEntry.item["_id"] === newItem.item["_id"] &&
                itemEntry.quantity === newItem.quantity &&
                itemEntry.section === newItem.section,
        );

        onUpdate(serverItem);

        event.target.reset();
    };

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
                        slotProps={{ htmlInput: { min: 0 } }}
                        size="small"
                        sx={{ m: 2, width: 0.8 }}
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
