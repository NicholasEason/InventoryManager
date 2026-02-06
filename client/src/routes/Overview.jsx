import { useEffect, useState } from "react";
import {
    Typography,
    Card,
    CardContent,
    Divider,
    Grid,
    Alert,
    Chip,
    Stack,
    Box,
} from "@mui/material";

const Overview = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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

    const currentQuantity = (warehouse) => {
        let total = 0;

        if (!warehouse || !warehouse["inventory"]) {
            return 0;
        }

        warehouse["inventory"].forEach((entry) => {
            total += Number(entry["quantity"]) || 0;
        });

        return total;
    };

    const capacityStatus = (current, maxCapacity) => {
        const cap = Number(maxCapacity) || 0;

        if (cap <= 0) {
            return {
                label: "No capacity set",
                severity: "warning",
                percent: null,
            };
        }

        const percent = (current / cap) * 100;

        if (current > cap) {
            return { label: "Over capacity", severity: "error", percent };
        }

        if (percent >= 90) {
            return { label: "Near capacity", severity: "warning", percent };
        }

        return { label: "OK", severity: "success", percent };
    };

    const getLastChange = (warehouse) => {
        return warehouse["updatedAt"] || warehouse["createdAt"] || null;
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

    const warehouseSummaries = warehouses.map((warehouse) => {
        const current = currentQuantity(warehouse);
        const cap = Number(warehouse["maxCapacity"]) || 0;

        const status = capacityStatus(current, cap);

        return {
            id: warehouse["_id"],
            name: warehouse["name"],
            location: warehouse["location"],
            maxCapacity: cap,
            current: current,
            status: status,
            lastChange: getLastChange(warehouse),
        };
    });

    let alerts = warehouseSummaries.filter(
        (warehouse) =>
            warehouse.status.severity === "warning" || warehouse.status.severity === "error",
    );

    alerts.sort((a, b) => {
        const rank = (sev) => (sev === "error" ? 2 : sev === "warning" ? 1 : 0);
        const aRank = rank(a.status.severity);
        const bRank = rank(b.status.severity);

        if (aRank !== bRank) return bRank - aRank;

        const aPct = a.status.percent ?? -1;
        const bPct = b.status.percent ?? -1;
        return bPct - aPct;
    });

    let recentActivity = [...warehouseSummaries];
    recentActivity.sort((a, b) => {
        const aTime = a.lastChange ? new Date(a.lastChange).getTime() : 0;
        const bTime = b.lastChange ? new Date(b.lastChange).getTime() : 0;
        return bTime - aTime;
    });
    recentActivity = recentActivity.slice(0, 6);

    const chipColor = (severity) => {
        if (severity === "error") return "error";
        if (severity === "warning") return "warning";
        return "success";
    };

    return (
        <Box
            sx={{
                width: "80%",
                mx: "auto",
            }}
        >
            <Typography variant="h4">Dashboard Overview</Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
            >
                Overview of all warehouses: capacity, recent activity, and alerts.
            </Typography>

            <Grid
                container
                spacing={2}
            >
                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <Card
                        variant="outlined"
                        square={true}
                    ></Card>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <Card
                        variant="outlined"
                        square={true}
                    >
                        <CardContent>
                            <Typography variant="h6">Recent Activity</Typography>
                            <Divider sx={{ my: 1.25 }} />

                            {recentActivity.length === 0 ? (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    No activity to show.
                                </Typography>
                            ) : (
                                recentActivity.map((w) => (
                                    <Typography
                                        key={w.id}
                                        variant="body2"
                                        sx={{ mb: 1 }}
                                    >
                                        <strong>{w.name}:</strong>{" "}
                                        {w.lastChange
                                            ? new Date(w.lastChange).toLocaleString()
                                            : "No timestamp available"}
                                    </Typography>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid
                    item
                    xs={12}
                    md={4}
                >
                    <Card
                        variant="outlined"
                        square={true}
                    >
                        <CardContent>
                            <Typography variant="h6">Alerts</Typography>
                            <Divider sx={{ my: 1.25 }} />

                            {alerts.length === 0 ? (
                                <Alert severity="success">No alerts.</Alert>
                            ) : (
                                alerts.slice(0, 6).map((w) => (
                                    <Alert
                                        key={w.id}
                                        severity={w.status.severity}
                                        sx={{ mb: 1 }}
                                    >
                                        <strong>{w.name}:</strong> {w.status.label}
                                        {w.status.percent != null
                                            ? ` (${w.status.percent.toFixed(1)}%)`
                                            : ""}
                                    </Alert>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid
                    item
                    xs={12}
                >
                    <Card
                        variant="outlined"
                        square={true}
                    >
                        <CardContent>
                            <Typography variant="h6">All Warehouses</Typography>
                            <Divider sx={{ my: 1.25 }} />

                            <Grid
                                container
                                spacing={2}
                            >
                                {warehouseSummaries.map((w) => (
                                    <Grid
                                        key={w.id}
                                        item
                                        xs={12}
                                        md={8}
                                        lg={6}
                                    >
                                        <Card
                                            variant="outlined"
                                            square={true}
                                            sx={{ height: "100%" }}
                                        >
                                            <CardContent>
                                                <Stack
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <span>
                                                        <Typography
                                                            variant="subtitle1"
                                                            fontWeight={600}
                                                        >
                                                            {w.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            {w.location}
                                                        </Typography>
                                                    </span>

                                                    <Chip
                                                        label={w.status.label}
                                                        color={chipColor(w.status.severity)}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                </Stack>

                                                <Divider sx={{ my: 1.25 }} />

                                                <Typography variant="body2">
                                                    <strong>Current:</strong> {w.current}
                                                </Typography>

                                                <Typography variant="body2">
                                                    <strong>Capacity:</strong>{" "}
                                                    {w.maxCapacity > 0 ? w.maxCapacity : "N/A"}
                                                </Typography>

                                                <Typography variant="body2">
                                                    <strong>Utilization:</strong>{" "}
                                                    {w.status.percent == null
                                                        ? "N/A"
                                                        : `${w.status.percent.toFixed(1)}%`}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Overview;
