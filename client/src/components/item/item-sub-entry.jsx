import {
    Typography,
    Button,
    Card,
    CardContent,
    Divider,
    Stack,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import UpdateInventoryItemForm from "../inventory/update-inventory-item-form";
import DeleteConfirmation from "../extras/delete-confirmation";
const ItemSubEntry = ({
    warehouse,
    id,
    quantity,
    section,
    item,
    onUpdate,
    onDelete,
    postUpdate,
}) => {
    const [updateItemModal, setUpdateItemModal] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);

    const handleDelete = async () => {
        setDeleteConfirmation(false);

        warehouse.inventory = warehouse.inventory.filter((itemEntry) => itemEntry["_id"] != id);

        await postUpdate(warehouse);

        onDelete(id);
    };

    return (
        <>
            <Card
                variant="outlined"
                square={true}
                sx={{ m: 1 }}
            >
                <CardContent>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                    >
                        {item.name}
                    </Typography>

                    <Divider sx={{ my: 1.25 }} />

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={{ xs: 0.5, sm: 3 }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            <strong>Quantity:</strong> {quantity}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            <strong>Section:</strong> {section}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            <strong>SKU:</strong> {item.sku}
                        </Typography>
                    </Stack>

                    {item.description ? (
                        <Typography
                            variant="body2"
                            sx={{ mt: 1.25 }}
                        >
                            <strong>Description:</strong> {item.description}
                        </Typography>
                    ) : null}

                    <div>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={() => setUpdateItemModal(true)}
                        >
                            Edit
                        </Button>

                        {/**I'll work on this if I have time, this is a less important feature */}
                        {/* <Button
                            variant="contained"
                            size="small"
                            color="secondary"
                            onClick={() => setTransferModal(true)}
                        >
                            Transfer
                        </Button> */}

                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => setDeleteConfirmation(true)}
                        >
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Dialog
                open={updateItemModal}
                onClose={() => setUpdateItemModal(false)}
            >
                <DialogTitle>{`Update ${item.name}`}</DialogTitle>
                <DialogContent>
                    <UpdateInventoryItemForm
                        warehouse={warehouse}
                        item={item}
                        id={id}
                        quantity={quantity}
                        section={section}
                        onUpdate={onUpdate}
                        postUpdate={postUpdate}
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
                message={`Are you sure you'd like to delete ${item.name} from ${warehouse.name}?`}
                title={`Delete ${item.name}`}
                onClose={() => setDeleteConfirmation(false)}
            />
        </>
    );
};

export default ItemSubEntry;
