import { useRef, useState } from "react";
import { TextField, Button, Alert, Snackbar } from "@mui/material";

const UpdateInventoryItemForm = ({ warehouse, id, quantity, section, onUpdate, postUpdate }) => {
    const quantityRef = useRef();
    const sectionRef = useRef();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const getWarehouseCapacity = () => {
        return Number(warehouse["maxCapacity"] ?? warehouse["capacity"]) || 0;
    };

    const getCurrentUsed = () => {
        if (!warehouse || !warehouse["inventory"]) return 0;

        return warehouse["inventory"].reduce((sum, entry) => {
            return sum + (Number(entry["quantity"]) || 0);
        }, 0);
    };

    const getOldQuantityFromWarehouse = () => {
        if (!warehouse || !warehouse["inventory"]) return Number(quantity) || 0;

        const entry = warehouse["inventory"].find((e) => e["_id"] === id);
        if (!entry) return Number(quantity) || 0;

        return Number(entry["quantity"]) || 0;
    };

    const cap = getWarehouseCapacity();
    const used = getCurrentUsed();
    const oldQuantity = getOldQuantityFromWarehouse();
    const usedExcludingThis = used - oldQuantity;
    const maxAllowed = cap > 0 ? Math.max(0, cap - usedExcludingThis) : undefined;

    const updateItemInInventory = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        const newSection = sectionRef.current?.value || "";
        const newQuantity = Number(quantityRef.current?.value) || 0;

        if (!newSection.trim() || newQuantity <= 0) {
            setError("Quantity and Section are required, and Quantity must be greater than 0.");
            setSubmitting(false);
            return;
        }

        if (cap > 0) {
            const newUsed = usedExcludingThis + newQuantity;

            if (newUsed > cap) {
                setError(`Warehouse capacity exceeded. Max allowed here is ${maxAllowed}.`);
                setSubmitting(false);
                return;
            }
        }

        warehouse.inventory = warehouse.inventory.map((entry) =>
            entry["_id"] === id ? { ...entry, quantity: newQuantity, section: newSection } : entry,
        );

        await postUpdate(warehouse);

        onUpdate(warehouse);
        setSubmitting(false);

        event.target.reset();
    };

    return (
        <>
            <form onSubmit={updateItemInInventory}>
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
                        defaultValue={quantity}
                        sx={{ m: 2, width: 0.8 }}
                        helperText={maxAllowed !== undefined ? `Max allowed: ${maxAllowed}` : ""}
                    />
                </div>

                <div>
                    <TextField
                        id="inventorySection"
                        label="Section"
                        inputRef={sectionRef}
                        variant="outlined"
                        size="small"
                        defaultValue={section}
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
            </form>
        </>
    );
};

export default UpdateInventoryItemForm;
