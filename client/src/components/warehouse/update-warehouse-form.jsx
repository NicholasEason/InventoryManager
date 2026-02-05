import { useRef, useState } from "react";
import { TextField, Button, Alert, Snackbar } from "@mui/material";

const UpdateWarehouseForm = ({ warehouseId, onUpdate, warehouseName }) => {
    const nameRef = useRef();
    const locationRef = useRef();
    const capacityRef = useRef();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const updateWarehouse = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        const name = nameRef.current?.value || "";
        const location = locationRef.current?.value || "";
        const capacity = Number(capacityRef.current?.value) || 0;

        if (!name.trim() || !location.trim() || capacity <= 0) {
            setError(
                "Name, Location, and Capacity are required, and Capacity must be greater than 0.",
            );
            setSubmitting(false);
            return;
        }

        try {
            let api_url = import.meta.env.VITE_API_HOST;
            if (import.meta.env.VITE_API_PORT) {
                api_url += `:${import.meta.env.VITE_API_PORT}`;
            }
            api_url += `/warehouses/${warehouseId}`;

            const request = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    location,
                    maxCapacity: capacity,
                }),
            };
            const response = await fetch(api_url, request);

            if (!response.ok) {
                throw new Error(response);
            }

            setSuccess(true);

            const updatedWarehouse = await response.json();
            onUpdate(updatedWarehouse);
            event.target.reset();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <form onSubmit={updateWarehouse}>
                <div>
                    <TextField
                        id="warehouseName"
                        label="Warehouse Name"
                        inputRef={nameRef}
                        variant="outlined"
                        size="small"
                        sx={{ m: 2, width: 0.8 }}
                    />
                </div>

                <div>
                    <TextField
                        id="warehouseLocation"
                        label="Warehouse Location"
                        inputRef={locationRef}
                        variant="outlined"
                        size="small"
                        sx={{ m: 2, width: 0.8 }}
                    />
                </div>

                <div>
                    <TextField
                        id="warehouseCapacity"
                        label="Warehouse Capacity"
                        type="number"
                        inputRef={capacityRef}
                        defaultValue={0}
                        slotProps={{ htmlInput: { min: 0 } }}
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
                        <Alert severity="success">Warehouse Updated.</Alert>
                    </Snackbar>
                )}
            </form>
        </>
    );
};

export default UpdateWarehouseForm;
