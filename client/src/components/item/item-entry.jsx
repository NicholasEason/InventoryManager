import {
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
            <span>
                <Typography variant="h6">{name}</Typography>
            </span>
            <Typography variant="body1">SKU: {sku}</Typography>
            <Typography variant="body1">Category: {category}</Typography>
            <Typography variant="body2">{description}</Typography>

            <span>
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
            </span>

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
