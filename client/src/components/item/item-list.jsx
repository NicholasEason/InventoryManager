import { useState, useEffect } from "react";
import {
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

import ItemEntry from "./item-entry";
import NewItemForm from "./new-item-form";

const ItemList = ({ itemEntries }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [changeSuccess, setChangeSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [newItemModal, setNewItemModal] = useState(false);

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
                if (!cancelled) setItems(data);
            } catch (error) {
                if (!cancelled) setError(error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadItems();

        return () => {
            cancelled = true;
        };
    }, []);

    const onNewItem = (newItem) => {
        setItems((oldState) => {
            return [...oldState, newItem];
        });
    };

    const onItemDelete = async (id) => {
        try {
            let api_url = import.meta.env.VITE_API_HOST;
            if (import.meta.env.VITE_API_PORT) {
                api_url += `:${import.meta.env.VITE_API_PORT}`;
            }
            api_url += `/items/${id}`;

            const request = {
                method: "DELETE",
            };

            const response = await fetch(api_url, request);

            if (!response.ok) {
                throw new Error(`Request Failed: ${response.status}`);
            }

            setItems((oldState) => {
                return oldState.filter((item) => item["_id"] != id);
            });
            setSuccessMessage(`Successfully deleted item.`);
            setChangeSuccess(true);
        } catch (error) {
            setError(error);
        }
    };

    const onItemUpdate = (id, updatedItem) => {
        setItems((oldState) => {
            return oldState.map((item) => (item["_id"] == id ? { ...item, ...updatedItem } : item));
        });
    };

    const isUniqueSKU = (sku) => {
        return !items.some((item) => item["sku"] === sku);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return (
            <>
                <p>Error: {error.message}</p>
                <p>Stack Trace:</p>
                <p>{error.stack}</p>
            </>
        );
    }

    return (
        <>
            <h2>All Items</h2>
            {items.map((item) => (
                <ItemEntry
                    key={item["_id"]}
                    id={item["_id"]}
                    name={item["name"]}
                    sku={item["sku"]}
                    description={item["description"]}
                    category={item["category"]}
                    onDelete={onItemDelete}
                    onUpdate={onItemUpdate}
                    isUniqueSKU={isUniqueSKU}
                />
            ))}

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

            <Snackbar
                open={changeSuccess}
                autoHideDuration={5000}
                onClose={() => setChangeSuccess(false)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
            >
                <Alert severity="success">{successMessage}</Alert>
            </Snackbar>
            <br></br>
            <Button
                variant="outlined"
                onClick={() => setNewItemModal(true)}
            >
                Add New Item
            </Button>

            <Dialog
                open={newItemModal}
                onClose={() => setNewItemModal(false)}
            >
                <DialogTitle>Add a New Item</DialogTitle>
                <DialogContent>
                    <NewItemForm
                        onUpdate={(data) => {
                            onNewItem(data);
                            setNewItemModal(false);
                        }}
                        isUniqueSKU={isUniqueSKU}
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
        </>
    );
};

export default ItemList;
