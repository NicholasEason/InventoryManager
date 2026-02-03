import { useRef, useState } from "react";

const NewWarehouseForm = () => {

    const nameRef = useRef();
    const locationRef = useRef();
    const capacityRef = useRef();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createWarehouse = async(event) => {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccess(false);

        const name = nameRef.current?.value || "";
        const location = locationRef.current?.value || "";
        const capacity = Number(capacityRef.current?.value) || 0;

        if(!name.trim() || !location.trim() || capacity <= 0){
            setError("Name, Location, and Capacity are required, and Capacity must be greater than 0.");
            console.log(`Name: ${name}, Location: ${location}, Capacity: ${capacity}`);
            setSubmitting(false);
            return;
        }

        try{
            let api_url = import.meta.env.VITE_API_HOST;
            if(import.meta.env.VITE_API_PORT){
                api_url += `:${import.meta.env.VITE_API_PORT}/warehouses`;
            }
            const request = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, location, maxCapacity: capacity
                })
            }
            const response = await fetch(api_url, request);

            if(!response.ok){
                console.log(response);
                throw new Error(response);
            }

            setSuccess(true);

        } catch (error){
            setError(error.message);
        }
    }

    return (
        <>
            <form onSubmit={createWarehouse}>
                <div>
                    <label htmlFor="warehouseName">Warehouse Name:</label>
                    <br></br>
                    <input type="text" id="warehouseName" ref ={nameRef} />
                </div>

                <div>
                    <label htmlFor="warehouseLocation">Warehouse Location:</label>
                    <br></br>
                    <input type="text" id="warehouseLocation" ref={locationRef} />
                </div>

                <div>
                    <label htmlFor="warehouseCapacity">Warehouse Capacity:</label>
                    <br></br>
                    <input type="number" min="0" id="warehouseCapacity" defaultValue="0" ref={capacityRef} />
                </div>

                <button type="submit" disabled={submitting} >Submit</button>

                {error && <p>Error: {error}</p>}
                {success && <p>Warehouse Created.</p>}
            </form>
        </>
    );
}

export default NewWarehouseForm;