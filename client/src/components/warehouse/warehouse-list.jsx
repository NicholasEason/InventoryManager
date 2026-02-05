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

import WarehouseEntry from "./warehouse-entry";
import NewWarehouseForm from "./new-warehouse-form";

const WarehouseList = ({ warehouseEntries }) => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [changeSuccess, setChangeSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [newWarehouseModal, setNewWarehouseModal] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadWarehouses = async () => {
            try {
                let api_url = import.meta.env.VITE_API_HOST;
                if (import.meta.env.VITE_API_PORT) {
                    api_url += `:${import.meta.env.VITE_API_PORT}`;
                }
                api_url += `/warehouses`;

                const response = await fetch(api_url);

                if (!response.ok) {
                    throw new Error(`Request Failed: ${response.status}`);
                }

                const data = await response.json();
                if (!cancelled) setWarehouses(data);
            } catch (error) {
                if (!cancelled) setError(error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadWarehouses();

        return () => {
            cancelled = true;
        };
    }, []);

    const onNewWarehouse = (newWarehouse) => {
        setWarehouses((oldState) => {
            return [...oldState, newWarehouse];
        });
    };

    const onWarehouseDelete = async (id) => {
        try {
            let api_url = import.meta.env.VITE_API_HOST;
            if (import.meta.env.VITE_API_PORT) {
                api_url += `:${import.meta.env.VITE_API_PORT}`;
            }
            api_url += `/warehouses/${id}`;

            const request = {
                method: "DELETE",
            };

            const response = await fetch(api_url, request);

            if (!response.ok) {
                throw new Error(`Request Failed: ${response.status}`);
            }

            setWarehouses((oldState) => {
                return oldState.filter((warehouse) => warehouse["_id"] != id);
            });
            setSuccessMessage(`Successfully deleted warehouse.`);
            setChangeSuccess(true);
        } catch (error) {
            setError(error);
        }
    };

    const onWarehouseUpdate = (id, updatedWarehouse) => {
        setWarehouses((oldState) => {
            return oldState.map((warehouse) =>
                warehouse["_id"] == id ? { ...warehouse, ...updatedWarehouse } : warehouse,
            );
        });
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
            <h2>All Warehouses</h2>
            {warehouses.map((warehouse) => (
                <WarehouseEntry
                    key={warehouse["_id"]}
                    id={warehouse["_id"]}
                    name={warehouse["name"]}
                    location={warehouse["location"]}
                    maxCapacity={warehouse["maxCapacity"]}
                    inventory={warehouse["inventory"]}
                    onDelete={onWarehouseDelete}
                    onUpdate={onWarehouseUpdate}
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

            <Button
                variant="outlined"
                onClick={() => setNewWarehouseModal(true)}
            >
                Add New Warehouse
            </Button>

            <Dialog
                open={newWarehouseModal}
                onClose={() => setNewWarehouseModal(false)}
            >
                <DialogTitle>Add a New Warehouse</DialogTitle>
                <DialogContent>
                    <NewWarehouseForm
                        onUpdate={(data) => {
                            onNewWarehouse(data);
                            setNewWarehouseModal(false);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setNewWarehouseModal(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default WarehouseList;
