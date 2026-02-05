import { useRef, useState } from "react";
import { TextField, Button, Alert, Snackbar } from "@mui/material";

const NewItemForm = ({ onUpdate, isUniqueSKU }) => {
    const nameRef = useRef();
    const skuRef = useRef();
    const categoryRef = useRef();
    const descriptionRef = useRef();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createItem = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        const name = nameRef.current?.value || "";
        const sku = skuRef.current?.value || "";
        const category = categoryRef.current?.value || "";
        const description = descriptionRef.current?.value || "";

        if (!name.trim() || !sku.trim() || !category.trim() || !description.trim()) {
            setError("Name, SKU, Category, and Description are required.");
            setSubmitting(false);
            return;
        }

        if (!isUniqueSKU(sku)) {
            setError("The SKU must be unique.");
            setSubmitting(false);
            return;
        }

        try {
            let api_url = import.meta.env.VITE_API_HOST;
            if (import.meta.env.VITE_API_PORT) {
                api_url += `:${import.meta.env.VITE_API_PORT}`;
            }
            api_url += `/items`;

            const request = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    description,
                    sku,
                    category,
                }),
            };
            const response = await fetch(api_url, request);

            if (!response.ok) {
                throw new Error(response);
            }

            setSuccess(true);

            const newItem = await response.json();
            onUpdate(newItem);
            event.target.reset();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <form onSubmit={createItem}>
                <div>
                    <TextField
                        id="itemName"
                        label="Item Name"
                        inputRef={nameRef}
                        variant="outlined"
                        size="small"
                        sx={{ m: 2, width: 0.8 }}
                    />
                </div>

                <div>
                    <TextField
                        id="itemSKU"
                        label="Item SKU"
                        inputRef={skuRef}
                        variant="outlined"
                        size="small"
                        sx={{ m: 2, width: 0.8 }}
                    />
                </div>

                <div>
                    <TextField
                        id="itemCategory"
                        label="Item Category"
                        inputRef={categoryRef}
                        variant="outlined"
                        size="small"
                        sx={{ m: 2, width: 0.8 }}
                    />
                </div>

                <div>
                    <TextField
                        id="itemDescription"
                        label="Item Description"
                        inputRef={descriptionRef}
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
                        <Alert severity="success">Item Created.</Alert>
                    </Snackbar>
                )}
            </form>
        </>
    );
};

export default NewItemForm;
