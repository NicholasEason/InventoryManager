import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";
const DeleteConfirmation = ({ message, title, active, onDelete, onClose }) => {
    const handleDelete = async (event) => {
        event.preventDefault();

        onDelete();
    };

    return (
        <>
            <Dialog
                open={active}
                onClose={onClose}
            >
                <DialogTitle>{`${title}`}</DialogTitle>
                <DialogContent>
                    <Typography>{message}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={onClose}
                        color="primary"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={onDelete}
                        color="error"
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteConfirmation;
