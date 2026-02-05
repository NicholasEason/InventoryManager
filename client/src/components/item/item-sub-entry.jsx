import {
    Typography,
    Button,
    IconButton,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Card,
    CardContent,
    Divider,
    Stack,
} from "@mui/material";

const ItemSubEntry = ({ quantity, section, item }) => {
    return (
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
            </CardContent>
        </Card>
    );
};

export default ItemSubEntry;
