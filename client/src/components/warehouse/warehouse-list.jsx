import { useState, useEffect } from "react";

import WarehouseEntry from "./warehouse-entry";

const WarehouseList = ({warehouseEntries}) => {

    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const loadWarehouses = async () => {
            try{
                let api_url = import.meta.env.VITE_API_HOST;
                if(import.meta.env.VITE_API_PORT){
                    api_url += `:${import.meta.env.VITE_API_PORT}/warehouses`;
                }

                const response = await fetch(api_url);

                if(!response.ok){
                    throw new Error(`Request Failed: ${response.status}`)
                }

                const data = await  response.json();
                console.log(data);
                if(!cancelled) setWarehouses(data);

            } catch (error){
                if(!cancelled) setError(error);
            } finally{
                if(!cancelled) setLoading(false);
            }
        }

        loadWarehouses();

        return () => {
            cancelled = true;
        }
    }, []);

    if(loading){
        return <p>Loading...</p>
    }

    if(error){
        return <>
            <p>Error: {error.message}</p>
            <p>Stack Trace:</p>
            <p>{error.stack}</p>
        </>
    }

    console.log("warehouses in WarehouseList:", warehouses);
    return (
        <>
            <h2>Warehouse List</h2>
            {warehouses.map((warehouse) => (
                <WarehouseEntry
                    key = {warehouse['_id']}
                    id = {warehouse['_id']}
                    name = {warehouse['name']}
                    location = {warehouse['location']}
                    maxCapacity ={warehouse['maxCapacity']} 
                    inventory = {warehouse['inventory']}
                    onDelete = {(id) => {}}
                    onUpdate = {(id) => {}}
                />
            ))}
        </>
    );
}

export default WarehouseList;