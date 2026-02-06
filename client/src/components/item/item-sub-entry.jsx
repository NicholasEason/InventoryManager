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
    Box,
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
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={1}
                    >
                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                            >
                                {item.name}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                SKU: {item.sku}
                            </Typography>
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
                    </Stack>

                    {item.description ? (
                        <Typography
                            variant="body2"
                            sx={{ mt: 1.25 }}
                        >
                            <strong>Description:</strong> {item.description}
                        </Typography>
                    ) : (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1.25 }}
                        >
                            <strong>Description:</strong> None
                        </Typography>
                    )}
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
                        onUpdate={async (...args) => {
                            await onUpdate(...args);
                            setUpdateItemModal(false);
                        }}
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
