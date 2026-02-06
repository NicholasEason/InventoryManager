import { useState, useEffect } from "react";
import {
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Stack,
    Divider,
    Card,
    CardContent,
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
            <Box
                sx={{
                    width: "80%",
                    mx: "auto",
                }}
            >
                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={1}
                    sx={{ mb: 1 }}
                >
                    <Typography variant="h4">Items</Typography>

                    <Button
                        variant="outlined"
                        onClick={() => setNewItemModal(true)}
                    >
                        Add New Item
                    </Button>
                </Stack>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Manage your item catalog. Add, edit, or delete items.
                </Typography>

                <Divider sx={{ my: 2 }} />

                {items.length === 0 ? (
                    <Card
                        variant="outlined"
                        square={true}
                    >
                        <CardContent>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                No items found.
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Stack spacing={2}>
                        {items.map((item) => (
                            <Card
                                key={item["_id"]}
                                variant="outlined"
                                square={true}
                            >
                                <CardContent>
                                    <ItemEntry
                                        id={item["_id"]}
                                        name={item["name"]}
                                        sku={item["sku"]}
                                        description={item["description"]}
                                        category={item["category"]}
                                        onDelete={onItemDelete}
                                        onUpdate={onItemUpdate}
                                        isUniqueSKU={isUniqueSKU}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Box>

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
