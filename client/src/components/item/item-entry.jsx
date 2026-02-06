import {
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    Box,
    Divider,
    Chip,
} from "@mui/material";
import { useState } from "react";
import UpdateItemForm from "./update-item-form";
import DeleteConfirmation from "../extras/delete-confirmation";

const ItemEntry = ({ id, name, sku, description, category, onUpdate, onDelete, isUniqueSKU }) => {
    const [updateItemModal, setUpdateItemModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    const handleUpdate = (updatedItem) => {
        onUpdate(id, updatedItem);
    };

    const handleDelete = () => {
        onDelete(id);
    };

    return (
        <>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={1}
            >
                <Box>
                    <Typography variant="h6">{name}</Typography>

                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 0.75 }}
                    >
                        <Chip
                            label={`SKU: ${sku}`}
                            size="small"
                            variant="outlined"
                        />
                        <Chip
                            label={`Category: ${category}`}
                            size="small"
                            variant="outlined"
                        />
                    </Stack>
                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                >
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => setUpdateItemModal(true)}
                    >
                        Edit
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => setDeleteConfirmation(true)}
                    >
                        Delete
                    </Button>
                </Stack>
            </Stack>

            <Divider sx={{ my: 1.25 }} />

            {description ? (
                <Typography variant="body2">{description}</Typography>
            ) : (
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    No description.
                </Typography>
            )}

            <Dialog
                open={updateItemModal}
                onClose={() => setUpdateItemModal(false)}
            >
                <DialogTitle>{`Edit Item "${name}"`}</DialogTitle>
                <DialogContent>
                    <UpdateItemForm
                        item={{
                            id: id,
                            name: name,
                            sku: sku,
                            description: description,
                            category: category,
                        }}
                        onUpdate={(data) => {
                            handleUpdate(data);
                            setUpdateItemModal(false);
                        }}
                        isUniqueSKU={isUniqueSKU}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setUpdateItemModal(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <DeleteConfirmation
                active={deleteConfirmation}
                onDelete={handleDelete}
                message={`Are you sure you'd like to delete ${name}?`}
                title={`Delete ${name}`}
                onClose={() => setDeleteConfirmation(false)}
            />
        </>
    );
};

export default ItemEntry;
